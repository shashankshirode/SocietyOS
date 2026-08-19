import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { CertificatePreview } from "../../../../ui/patterns/CertificatePreview";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { useCreateNocRequest } from "../data/useCreateNocRequest";
import type { NocType } from "../../../../shared/types/noc.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBorderColorBackgroundColorStyle, createViewBorderColorStyle, createViewBorderColorStyle2, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/CreateNocRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
const STEPS = ['Select Type', 'Evidence', 'Clearance', 'Preview'];
const NOC_TYPES: {
    key: NocType;
    label: string;
    icon: string;
}[] = [
    { key: 'NO_DUES', get label() {
            return getActiveUiLiteral("m_c413dd6c386d");
        }, icon: 'cash-outline' },
    { key: 'MOVE_OUT', get label() {
            return getActiveUiLiteral("m_be352e045a2c");
        }, icon: 'exit-outline' },
    { key: 'TENANT_NOC', get label() {
            return getActiveUiLiteral("m_bb51c5c60ba5");
        }, icon: 'people-outline' },
    { key: 'PARKING_NOC', get label() {
            return getActiveUiLiteral("m_b47f48ec46e3");
        }, icon: 'car-outline' },
    { key: 'RENOVATION_NOC', get label() {
            return getActiveUiLiteral("m_218986289afa");
        }, icon: 'construct-outline' },
    { key: 'RESIDENCE_CERTIFICATE', get label() {
            return getActiveUiLiteral("m_10b8b8a44351");
        }, icon: 'ribbon-outline' },
];
export function CreateNocRequestScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const [stepIndex, setStepIndex] = useState(0);
    const { submit, isSubmitting } = useCreateNocRequest();
    const [form, setForm] = useState({
        nocType: 'NO_DUES' as NocType,
        reason: '',
        filesAttached: false,
        clearedAllDues: true
    });
    const nextStep = () => {
        if (stepIndex === 1 && !form.reason.trim()) {
            AppAlert.alert(String(localizedUiText.m_74835b2b1e73), String(localizedUiText.m_3e50ebf410c8));
            return;
        }
        if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
        }
    };
    const prevStep = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };
    const handleCreate = async () => {
        const res = await submit({
            nocType: form.nocType,
            reason: form.reason,
            requiredByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_5c0c54615ce4), [
                { text: String(localizedUiText.m_b828cd2ffd65), onPress: () => navigation.navigate('NocRequestList') },
            ]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), res.error.message || String(localizedUiText.m_df6b0a5aa183));
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_c2ffb9ac3366} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_c2de747a17e4}</SafeText>
            <View style={styles.grid}>
              {NOC_TYPES.map((t) => {
                const isSelected = form.nocType === t.key;
                return (<PressableScale key={t.key} onPress={() => setForm({ ...form, nocType: t.key })} style={styles.gridItem}>
                    <View style={[
                        styles.catCard,
                        createViewBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                    ]}>
                      <Ionicons name={t.icon as keyof typeof Ionicons.glyphMap} size={22} color={isSelected ? '#FFFFFF' : theme.accent}/>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(isSelected ? '#FFFFFF' : theme.textPrimary)} align="center">
                        {t.label}
                      </SafeText>
                    </View>
                  </PressableScale>);
            })}
            </View>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_1e13d6dbbe0d}</SafeText>
            <FormField label={localizedUiText.m_4c539d820a25} value={form.reason} onChangeText={(val) => setForm({ ...form, reason: val })} placeholder={localizedUiText.m_ddc71946bae8} multiline numberOfLines={4}/>

            <View style={styles.evidenceGrid}>
              <PressableScale onPress={() => setForm({ ...form, filesAttached: true })} style={styles.pressableScaleFlex}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
                  <Ionicons name="document-attach-outline" size={24} color={theme.accent}/>
                  <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textPrimary)}>
                    {form.filesAttached ? localizedUiText.m_7d4b6be4efe7 : localizedUiText.m_b140f62124c5}
                  </SafeText>
                </View>
              </PressableScale>
            </View>
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_ddad46bb8f8c}</SafeText>
            <SafeText variant="caption" color="muted">{localizedUiText.m_2ba041d27c41}</SafeText>

            <View style={[styles.checkRow, createViewBorderColorStyle(theme.border)]}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success}/>
              <View>
                <SafeText variant="caption" style={createSafeTextColorStyle6(theme.textPrimary)}>{localizedUiText.m_fad1186444d8}</SafeText>
                <SafeText variant="tiny" color="muted">{localizedUiText.m_598301c25e9f}</SafeText>
              </View>
            </View>

            <View style={[styles.checkRow, createViewBorderColorStyle2(theme.border)]}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success}/>
              <View>
                <SafeText variant="caption" style={createSafeTextColorStyle7(theme.textPrimary)}>{localizedUiText.m_7aa216a00fa0}</SafeText>
                <SafeText variant="tiny" color="muted">{localizedUiText.m_0494eea4c597}</SafeText>
              </View>
            </View>
          </View>)}

        {stepIndex === 3 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(theme.textPrimary)} align="center">{localizedUiText.m_cfdc7746ea70}</SafeText>
            <CertificatePreview title={formatUiLiteral(localizedUiText.m_366542a4d9ec, [form.nocType.replace('_', ' ')])} certificateNumber="NOC-2026-99120" residentName="Shashank Shirode" unitLabel="A-1204" issueDate="Today (Pending submit)"/>
          </View>)}
      </ScrollView>

      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={localizedUiText.m_f7cbed165f44} onPress={handleCreate} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>
    </View>);
}
export default CreateNocRequestScreen;

