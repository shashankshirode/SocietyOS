import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosPermissions } from "../../hooks/useSosPermissions";
import { SosRecipientRow } from "../../components/sos/SosRecipientRow";
import { sosConfigurationRepository } from "../../data/sosConfiguration.repository";
import { getSosTypeDefinition } from "../../data/sosTypeDefinitions";
import type { SosResponsePlan, SosRecipientRule, SosType } from "../../data/sosResponsePlan.types";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createScrollViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createSafeTextColorStyle9, createViewBackgroundColorStyle4, createSafeTextColorStyle10, createSafeTextColorStyle11, createSafeTextColorStyle12, createViewBackgroundColorBorderColorStyle2, createSafeTextColorStyle13, createViewBackgroundColorBorderColorStyle3, createPressableBorderColorStyle } from "../../styles/screens/sos/SosResponsePlanDetailsScreen.styles";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'SosResponsePlanDetails'>;
export function SosResponsePlanDetailsScreen({ navigation, route }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { sosType } = route.params;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { canManagePlans } = useSosPermissions();
    const [plan, setPlan] = useState<SosResponsePlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [savingRuleId, setSavingRuleId] = useState<string | null>(null);
    const definition = getSosTypeDefinition(sosType as SosType);
    const planMsg = messages.resident?.emergency?.sosPlans ?? {};
    const typeMsg = messages.resident?.emergency?.sosSettings?.types?.[sosType as SosType] ?? {};
    const load = useCallback(async () => {
        if (!context)
            return;
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const result = await sosConfigurationRepository.getResponsePlan(context, sosType as SosType);
            setPlan(result);
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : getActiveUiLiteral("m_4a67cac0172d"));
        }
        finally {
            setIsLoading(false);
        }
    }, [context, sosType]);
    useEffect(() => {
        load();
    }, [load]);
    const handleReset = useCallback(async () => {
        if (!context)
            return;
        setErrorMessage(null);
        try {
            const reset = await sosConfigurationRepository.resetToDefault(context, sosType as SosType);
            setPlan(reset);
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : getActiveUiLiteral("m_8660ef62e419"));
        }
    }, [context, sosType]);
    const handleToggleRule = useCallback(async (rule: SosRecipientRule) => {
        if (!context || !plan || rule.mandatory || savingRuleId)
            return;
        setSavingRuleId(rule.recipientId);
        setErrorMessage(null);
        try {
            const nextPlan: SosResponsePlan = {
                ...plan,
                mode: 'custom',
                version: plan.version + 1,
                updatedAt: new Date().toISOString(),
                recipientRules: plan.recipientRules.map((candidate) => (candidate.recipientId === rule.recipientId
                    ? { ...candidate, enabled: !candidate.enabled }
                    : candidate))
            };
            const saved = await sosConfigurationRepository.saveResponsePlan(context, nextPlan);
            setPlan(saved);
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : getActiveUiLiteral("m_665e61a078a8"));
        }
        finally {
            setSavingRuleId(null);
        }
    }, [context, plan, savingRuleId]);
    if (isLoading) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle(colors.background)]}>
        <ActivityIndicator size="large" color={colors.textSecondary}/>
      </View>);
    }
    if (!plan) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle2(colors.background)]}>
        <ErrorState message={errorMessage ?? localizedUiText.m_2b927f926e77} onRetry={load}/>
      </View>);
    }
    const mandatoryRules = plan.recipientRules.filter((r) => r.mandatory && r.enabled);
    const personalRules = plan.recipientRules.filter((r) => !r.mandatory);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content}>
      <View style={[styles.headerCard, createViewBackgroundColorBorderColorStyle((definition?.color ?? '#DC2626') + '10', colors.border)]}>
        <View style={[styles.headerIcon, createViewBackgroundColorStyle3((definition?.color ?? '#DC2626') + '20')]}>
          <Ionicons name={(definition?.icon ?? 'alert-circle') as keyof typeof Ionicons.glyphMap} size={28} color={definition?.color ?? '#DC2626'}/>
        </View>
        <SafeText variant="bodyStrong" style={[styles.headerTitle, createSafeTextColorStyle9(colors.textPrimary)]}>
          {typeMsg?.title ?? sosType}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)}>
          {typeMsg?.description ?? ''}
        </SafeText>
        <View style={[styles.modeBadge, createViewBackgroundColorStyle4(plan.mode === 'custom' ? '#3B82F6' + '18' : '#6B7280' + '18')]}>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(plan.mode === 'custom' ? '#3B82F6' : '#6B7280')}>
            {plan.mode === 'custom' ? (planMsg?.custom ?? localizedUiText.m_92fafa355b15) : (planMsg?.recommended ?? localizedUiText.m_9b0fe65e817b)}
          </SafeText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="lock-closed" size={16} color="#10B981"/>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle10(colors.textPrimary)]}>
            {planMsg?.mandatoryResponders ?? localizedUiText.m_bb63e88d7cf1}
          </SafeText>
        </View>
        <SafeText variant="tiny" style={[styles.sectionNote, createSafeTextColorStyle11(colors.textSecondary)]}>
          {planMsg?.mandatoryResponderNote ?? localizedUiText.m_4a5473638b12}
        </SafeText>
        {mandatoryRules.map((rule) => (<SosRecipientRow key={rule.recipientId} rule={rule}/>))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={16} color="#3B82F6"/>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle12(colors.textPrimary)]}>
            {planMsg?.personalResponders ?? localizedUiText.m_3033cc640e38}
          </SafeText>
        </View>
        {personalRules.length === 0 ? (<View style={[styles.emptyCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
            <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textSecondary)}>
              {planMsg?.personalRespondersEmpty ?? localizedUiText.m_5eba682f4cc5}
            </SafeText>
          </View>) : (personalRules.map((rule) => (<SosRecipientRow key={rule.recipientId} rule={rule} {...includeWhenPresent("onPress", canManagePlans && !savingRuleId ? () => handleToggleRule(rule) : undefined)}/>)))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="timer" size={16} color="#F59E0B"/>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle13(colors.textPrimary)]}>
            {planMsg?.escalationOrder ?? localizedUiText.m_24eaeececa31}
          </SafeText>
        </View>
        <View style={[styles.escalationCard, createViewBackgroundColorBorderColorStyle3(colors.surface, colors.border)]}>
          <SafeText variant="caption" style={[styles.escalationLabel, styles.safeTextColor]}>
            {planMsg?.immediately ?? localizedUiText.m_0fe556b25edd}
          </SafeText>
          {plan.recipientRules.filter((r) => r.enabled && r.notifyImmediately).map((rule, idx) => (<SafeText key={rule.recipientId} variant="caption" style={createSafeTextColorStyle4(colors.textPrimary)}>
              {`${idx + 1}. ${rule.recipientDisplayName}`}
            </SafeText>))}

          {plan.recipientRules.filter((r) => r.enabled && !r.notifyImmediately).length > 0 && (<>
              <SafeText variant="caption" style={[styles.escalationLabel, styles.safeTextColorMarginTop]}>{localizedUiText.m_179307927775}</SafeText>
              {plan.recipientRules.filter((r) => r.enabled && !r.notifyImmediately).map((rule, idx) => (<SafeText key={rule.recipientId} variant="caption" style={createSafeTextColorStyle5(colors.textPrimary)}>
                  {formatUiLiteral(localizedUiText.m_4b0d238cae42, [idx + plan.recipientRules.filter((r) => r.enabled && r.notifyImmediately).length + 1, rule.recipientDisplayName, rule.escalationDelaySeconds])}
                </SafeText>))}
            </>)}
        </View>
      </View>

      {errorMessage ? <ErrorState message={errorMessage}/> : null}

      {canManagePlans && plan.mode === 'custom' && (<Pressable onPress={handleReset} style={[styles.resetButton, createPressableBorderColorStyle(colors.border)]} accessibilityRole="button" accessibilityLabel={planMsg?.resetToDefault ?? localizedUiText.m_48ae42a194f9}>
          <Ionicons name="refresh" size={18} color={colors.textSecondary}/>
          <SafeText variant="caption" style={createSafeTextColorStyle6(colors.textSecondary)}>
            {planMsg?.resetToDefault ?? localizedUiText.m_48ae42a194f9}
          </SafeText>
        </Pressable>)}

      <View style={styles.metadataRow}>
        <SafeText variant="tiny" style={createSafeTextColorStyle7(colors.textSecondary)}>
          {`${planMsg?.lastUpdated ?? localizedUiText.m_382ac5f308f7}: ${formatResidentDateTime(plan.updatedAt)}`}
        </SafeText>
        {plan.lastTestedAt && (<SafeText variant="tiny" style={createSafeTextColorStyle8(colors.textSecondary)}>
            {`${planMsg?.lastTested ?? localizedUiText.m_b43b65bd2409}: ${formatResidentDateTime(plan.lastTestedAt)}`}
          </SafeText>)}
      </View>
    </ScrollView>);
}

