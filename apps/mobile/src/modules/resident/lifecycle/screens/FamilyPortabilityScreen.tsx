import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { resolveRequestContext } from "../../homeContext/utils/resolveRequestContext";
import { residentLifecycleRepository } from "../data/residentLifecycle.repository";
import type { FamilyPortabilityPlan, FamilyPortabilityResult, FamilyStayPattern } from "../data/residentLifecycle.types";
import { defaultFamilyAccessPermissions } from "../../household/data/residentHousehold.types";
import { LifecycleCard, LifecycleScreenFrame } from "./LifecycleScreenFrame";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createPressableBorderColorStyle, createPressableBorderColorStyle2, createPressableBorderColorBackgroundColorStyle, createViewBorderColorBackgroundColorStyle } from "../styles/screens/FamilyPortabilityScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<HomeStackParamList, 'FamilyPortability'>;
const stayPatterns: readonly FamilyStayPattern[] = ['secondarySeasonalResident', 'occasionalFamilyVisitor', 'emergencyContactOnly', 'guardianManagedChild'];
export function FamilyPortabilityScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { activeContext } = useActiveResidentHome();
    const [plan, setPlan] = useState<FamilyPortabilityPlan | null>(null);
    const [selectedMemberIds, setSelectedMemberIds] = useState<readonly string[]>([]);
    const [targetHomeContextId, setTargetHomeContextId] = useState('');
    const [stayPattern, setStayPattern] = useState<FamilyStayPattern>('secondarySeasonalResident');
    const [consentConfirmed, setConsentConfirmed] = useState(false);
    const [result, setResult] = useState<FamilyPortabilityResult | null>(null);
    const [error, setError] = useState<string | Absent>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const load = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        try {
            const next = await residentLifecycleRepository.getFamilyPortabilityPlan(resolveRequestContext({ activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }));
            setPlan(next);
            setTargetHomeContextId(next.eligibleTargetContexts[0]?.activeHome.homeContextId ?? '');
        }
        catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : getActiveUiLiteral("m_6b80679b4e8b"));
        }
        finally {
            setLoading(false);
        }
    }, [activeContext]);
    useEffect(() => {
        void load();
    }, [load]);
    const targetHomes = useMemo(() => plan?.eligibleTargetContexts ?? [], [plan]);
    const toggleMember = (memberId: string) => {
        setSelectedMemberIds((current) => current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]);
    };
    const submit = async () => {
        if (!plan || selectedMemberIds.length === 0) {
            setError(getActiveUiLiteral("m_ae6198fcdb43"));
            return;
        }
        const targetContext = plan.eligibleTargetContexts.find((candidate) => candidate.activeHome.homeContextId === targetHomeContextId);
        if (!targetContext) {
            setError(getActiveUiLiteral("m_6c0bc8eda576"));
            return;
        }
        setSubmitting(true);
        setError(undefined);
        try {
            const portabilityResult = await residentLifecycleRepository.executeFamilyPortability({
                sourceContext: resolveRequestContext({ activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }),
                targetContext,
                familyMemberIds: selectedMemberIds,
                relationToOwner: 'OTHER',
                stayPattern,
                permissions: defaultFamilyAccessPermissions,
                consentConfirmed,
            });
            setResult(portabilityResult);
        }
        catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : getActiveUiLiteral("m_15feb7ed3eb1"));
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading)
        return <LoadingState message={localizedUiText.m_e5232da102c5} showCardPlaceholder/>;
    if (error && !plan)
        return <ErrorState title={localizedUiText.m_ad7e6b9551e4} message={error} onRetry={load}/>;
    if (!plan || plan.sourceMembers.length === 0)
        return <EmptyState title={localizedUiText.m_ac025666c606} description={localizedUiText.m_e22fce7af9d8} actionLabel={localizedUiText.m_0919cce1c67f} onAction={navigation.goBack}/>;
    return (<LifecycleScreenFrame title={localizedUiText.m_d2c793aa1036} subtitle={localizedUiText.m_fe548fa51c86}>
      <LifecycleCard title={localizedUiText.m_c33b76cf901a} description={localizedUiText.m_bc265b0380af}>
        {plan.sourceMembers.map((member) => (<Pressable key={member.id} accessibilityRole="checkbox" accessibilityState={{ checked: selectedMemberIds.includes(member.id) }} onPress={() => toggleMember(member.id)} style={[styles.option, createPressableBorderColorStyle(selectedMemberIds.includes(member.id) ? colors.primary : colors.border)]}>
            <SafeText variant="bodyStrong">{member.fullName}</SafeText>
            <SafeText variant="caption" color="secondary">{member.relationToOwner} · {member.isMinor ? localizedUiText.m_6fdd6d22c2ca : localizedUiText.m_0be159e66bf9}</SafeText>
          </Pressable>))}
      </LifecycleCard>

      <LifecycleCard title={localizedUiText.m_544e8a15186e}>
        {targetHomes.map((target) => (<Pressable key={target.activeHome.homeContextId} accessibilityRole="radio" accessibilityState={{ selected: targetHomeContextId === target.activeHome.homeContextId }} onPress={() => setTargetHomeContextId(target.activeHome.homeContextId)} style={[styles.option, createPressableBorderColorStyle2(targetHomeContextId === target.activeHome.homeContextId ? colors.primary : colors.border)]}> 
            <SafeText variant="bodyStrong">{target.activeHome.societyName}</SafeText>
            <SafeText variant="caption" color="secondary">{target.activeHome.displayUnitName}</SafeText>
          </Pressable>))}
      </LifecycleCard>

      <LifecycleCard title={localizedUiText.m_2da355533b26}>
        <View style={styles.chips}>
          {stayPatterns.map((pattern) => (<Pressable key={pattern} onPress={() => setStayPattern(pattern)} style={[styles.chip, createPressableBorderColorBackgroundColorStyle(stayPattern === pattern ? colors.primary : colors.border, stayPattern === pattern ? colors.primarySoft : colors.surface)]}>
              <SafeText variant="caption">{pattern.replace(/([A-Z])/g, ' $1')}</SafeText>
            </Pressable>))}
        </View>
        <SafeText variant="caption" color="secondary">{localizedUiText.m_cd9bf7911a1f}</SafeText>
      </LifecycleCard>

      <LifecycleCard title={localizedUiText.m_153d9ec4ca07}>
        {plan.reusableDocuments.map((document) => <SafeText key={document.documentId} variant="caption" color="success">{localizedUiText.m_aef4d62175a9 + " "}{document.title}</SafeText>)}
        {plan.missingLocalDocumentTitles.map((title) => <SafeText key={title} variant="caption" color="warning">{localizedUiText.m_a6f8158377dd + " "}{title}</SafeText>)}
      </LifecycleCard>

      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consentConfirmed }} onPress={() => setConsentConfirmed((value) => !value)} style={styles.consentRow}>
        <View style={[styles.checkbox, createViewBorderColorBackgroundColorStyle(colors.primary, consentConfirmed ? colors.primary : 'transparent')]}/>
        <SafeText variant="body" color="secondary" style={styles.consentText}>{localizedUiText.m_05893b4e8c53}</SafeText>
      </Pressable>
      {error ? <SafeText variant="body" color="danger">{error}</SafeText> : null}
      {result ? <LifecycleCard title={localizedUiText.m_6da85db8ee77} description={formatUiLiteral(localizedUiText.m_aab8104849e6, [result.results.filter((entry) => entry.outcome !== 'failed').length])}/> : null}
      <AppButton title={localizedUiText.m_60f7a0720a61} onPress={submit} loading={submitting} disabled={!consentConfirmed || selectedMemberIds.length === 0} fullWidth/>
    </LifecycleScreenFrame>);
}

