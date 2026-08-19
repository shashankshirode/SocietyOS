import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { AppTextInput } from "../../../ui/forms/AppTextInput";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceRoleLabels } from "../../../messages/en/residenceAccess.messages";
import type { LinkResidenceInput, ResidenceAccessRepositoryError, ResidenceRole } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { ResidenceQrScannerSheet } from "../components/ResidenceQrScannerSheet";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createPressableBorderColorBackgroundColorStyle, createPressableBorderColorBackgroundColorStyle2 } from "../styles/screens/ResidenceLinkHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type LinkMethod = LinkResidenceInput['method'];
const methods: readonly LinkMethod[] = ['INVITE_CODE', 'SOCIETY_SEARCH', 'QR_CODE', 'UNIT_DETAILS'];
const roles: readonly ResidenceRole[] = ['OWNER', 'CO_OWNER', 'TENANT', 'FAMILY_MEMBER', 'AUTHORIZED_OCCUPANT'];
const draftKeys = {
    society: '@societyos/residence-link-draft/society',
    unit: '@societyos/residence-link-draft/unit',
    get relationship() {
        return getActiveUiLiteral("m_8f4cb725a97d");
    }
} as const;
function methodLabel(method: LinkMethod): string {
    switch (method) {
        case 'INVITE_CODE': return residenceAccessMessages.link.methodInvite;
        case 'SOCIETY_SEARCH': return residenceAccessMessages.link.methodSearch;
        case 'QR_CODE': return residenceAccessMessages.link.methodQr;
        case 'UNIT_DETAILS': return residenceAccessMessages.link.methodUnit;
    }
}
interface ResidenceLinkHomeScreenProps {
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onSubmit: (input: Omit<LinkResidenceInput, 'userId' | 'idempotencyKey'>) => Promise<boolean>;
    readonly onLinked: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceLinkHomeScreen({ activeMutation, error, onBack, onSubmit, onLinked, onDismissError, }: ResidenceLinkHomeScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const [method, setMethod] = useState<LinkMethod>('INVITE_CODE');
    const [societyIdentifier, setSocietyIdentifier] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [role, setRole] = useState<ResidenceRole>('TENANT');
    const [relationshipDescription, setRelationshipDescription] = useState('');
    const [scannerVisible, setScannerVisible] = useState(false);
    const [draftRecovered, setDraftRecovered] = useState(false);
    useEffect(() => {
        let active = true;
        void Promise.all([
            AsyncStorage.getItem(draftKeys.society),
            AsyncStorage.getItem(draftKeys.unit),
            AsyncStorage.getItem(draftKeys.relationship),
        ]).then(([society, unit, relationship]) => {
            if (!active)
                return;
            if (society)
                setSocietyIdentifier(society);
            if (unit)
                setUnitNumber(unit);
            if (relationship)
                setRelationshipDescription(relationship);
            setDraftRecovered(Boolean(society || unit || relationship));
        });
        return () => { active = false; };
    }, []);
    useEffect(() => {
        void AsyncStorage.multiSet([
            [draftKeys.society, societyIdentifier],
            [draftKeys.unit, unitNumber],
            [draftKeys.relationship, relationshipDescription],
        ]);
    }, [relationshipDescription, societyIdentifier, unitNumber]);
    const submit = async () => {
        const didLink = await onSubmit({
            method,
            societyIdentifier: societyIdentifier.trim(),
            unitNumber: unitNumber.trim(),
            role,
            ...includeWhenPresent("relationshipDescription", relationshipDescription.trim() || undefined)
        });
        if (didLink) {
            await AsyncStorage.multiRemove(Object.values(draftKeys));
            onLinked();
        }
    };
    const selectMethod = (value: LinkMethod) => {
        setMethod(value);
        if (value === 'QR_CODE') {
            setScannerVisible(true);
        }
    };
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.link.title} subtitle={residenceAccessMessages.link.subtitle} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onDismiss={onDismissError}/> : null}
      <StatusExplanationPanel title={residenceAccessMessages.link.verificationNotice} body={residenceAccessMessages.link.subtitle} tone="info"/>
      {draftRecovered ? <AppText variant="caption" tone="secondary">{residenceAccessMessages.link.resumeDraft}</AppText> : null}
      <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.link.method}</AppText>
      <View style={styles.optionGrid}>
        {methods.map((entry) => {
            const selected = entry === method;
            return (<Pressable key={entry} onPress={() => selectMethod(entry)} accessibilityRole="radio" accessibilityState={{ selected }} style={[styles.option, createPressableBorderColorBackgroundColorStyle(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface)]}>
              <AppText variant="bodySmall" weight={selected ? '800' : '600'}>{methodLabel(entry)}</AppText>
            </Pressable>);
        })}
      </View>
      <View style={styles.form}>
        <AppText variant="caption" weight="700">{residenceAccessMessages.link.societyIdentifier}</AppText>
        <AppTextInput value={societyIdentifier} onChangeText={setSocietyIdentifier} placeholder={residenceAccessMessages.link.societyPlaceholder} autoCapitalize="characters" maxLength={80}/>
        <AppText variant="caption" weight="700">{residenceAccessMessages.link.unitNumber}</AppText>
        <AppTextInput value={unitNumber} onChangeText={setUnitNumber} placeholder={residenceAccessMessages.link.unitPlaceholder} autoCapitalize="characters" maxLength={40}/>
        <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.link.role}</AppText>
        <View style={styles.optionGrid}>
          {roles.map((entry) => {
            const selected = entry === role;
            return (<Pressable key={entry} onPress={() => setRole(entry)} accessibilityRole="radio" accessibilityState={{ selected }} style={[styles.option, createPressableBorderColorBackgroundColorStyle2(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface)]}>
                <AppText variant="bodySmall" weight={selected ? '800' : '600'}>{residenceRoleLabels[entry]}</AppText>
              </Pressable>);
        })}
        </View>
        <AppText variant="caption" weight="700">{residenceAccessMessages.link.relationshipOptional}</AppText>
        <AppTextInput value={relationshipDescription} onChangeText={setRelationshipDescription} placeholder={residenceAccessMessages.link.relationshipPlaceholder} maxLength={160}/>
      </View>
      <AppButton title={residenceAccessMessages.link.submit} onPress={() => { void submit(); }} disabled={!societyIdentifier.trim() || !unitNumber.trim()} loading={activeMutation === 'LINK_RESIDENCE'} fullWidth/>
      <ResidenceQrScannerSheet visible={scannerVisible} onScanned={(identifier) => { setSocietyIdentifier(identifier); setMethod('QR_CODE'); }} onDismiss={() => setScannerVisible(false)}/>
    </ScreenScaffold>);
}

