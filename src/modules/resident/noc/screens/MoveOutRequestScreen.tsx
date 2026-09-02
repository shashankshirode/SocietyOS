import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { SocietySwitch } from "../../../../ui/controls/SocietySwitch";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createViewBackgroundColorStyle, createViewBorderColorStyle, createViewBorderColorStyle2, createViewBackgroundColorBorderColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/MoveOutRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
const STEPS = ['Details', 'Services', 'Review'];
export function MoveOutRequestScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState({
        proposedDate: '',
        reason: '',
        moverName: '',
        liftReserved: true,
        gatePassRequired: true,
        newAddress: ''
    });
    const nextStep = () => {
        if (stepIndex === 0 && (!form.proposedDate || !form.reason)) {
            AppAlert.alert(String(localizedUiText.m_74835b2b1e73), String(localizedUiText.m_350762676984));
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
    const handleSubmit = () => {
        AppAlert.alert(String(localizedUiText.m_d0577b401b19), String(localizedUiText.m_384af3ec4ab6), [
            {
                text: String(localizedUiText.m_17e07ef8afe7),
                onPress: () => navigation.navigate('MoveOutClearanceChecklist', { moveOutRequestId: 'mo-001' })
            },
        ]);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_a8150bf35029} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_3803b288d8f4}</SafeText>
            <FormField label={localizedUiText.m_3aba2c499822} value={form.proposedDate} onChangeText={(val) => setForm({ ...form, proposedDate: val })} placeholder={localizedUiText.m_dbffec00917a}/>
            <FormField label={localizedUiText.m_225e2abb60c4} value={form.reason} onChangeText={(val) => setForm({ ...form, reason: val })} placeholder={localizedUiText.m_26778d873c79} multiline numberOfLines={3}/>
            <FormField label={localizedUiText.m_0605e7fcb136} value={form.newAddress} onChangeText={(val) => setForm({ ...form, newAddress: val })} placeholder={localizedUiText.m_5e185907b741}/>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_79f8a2ab17c4}</SafeText>
            <FormField label={localizedUiText.m_209295fc45c4} value={form.moverName} onChangeText={(val) => setForm({ ...form, moverName: val })} placeholder={localizedUiText.m_1bff68dea818}/>

            <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
              <View style={styles.switchText}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{localizedUiText.m_cf6961ece16b}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textSecondary)}>{localizedUiText.m_1a0017ff5751}</SafeText>
              </View>
              <SocietySwitch value={form.liftReserved} onValueChange={(val) => setForm({ ...form, liftReserved: val })}/>
            </View>

            <View style={[styles.switchRow, createViewBorderColorStyle2(theme.border)]}>
              <View style={styles.switchText}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_ea8b530fddde}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.textSecondary)}>{localizedUiText.m_a9f1c085c995}</SafeText>
              </View>
              <SocietySwitch value={form.gatePassRequired} onValueChange={(val) => setForm({ ...form, gatePassRequired: val })}/>
            </View>
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle7(theme.textPrimary)}>{localizedUiText.m_57c359bcfd68}</SafeText>
            <View style={[styles.reviewCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(theme.textPrimary)}>{localizedUiText.m_65eac6752d75 + " "}{form.proposedDate}</SafeText>
              <SafeText variant="caption" color="secondary">{localizedUiText.m_3425d1086921 + " "}{form.reason}</SafeText>
              <SafeText variant="caption" color="secondary">{localizedUiText.m_894501149267 + " "}{form.moverName || localizedUiText.m_16156d20a6ec}</SafeText>
              <View style={styles.reviewFooter}>
                <SafeText variant="tiny" style={createSafeTextColorStyle9(theme.textSecondary)}>{localizedUiText.m_de0b21ea0c7f}{form.liftReserved ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}
                </SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle10(theme.textSecondary)}>{localizedUiText.m_38c187ffc27c}{form.gatePassRequired ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}
                </SafeText>
              </View>
            </View>
            <PrivacyNoticePanel description={localizedUiText.m_6faadbb745c3}/>
          </View>)}
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={localizedUiText.m_3f44a8fa403d} onPress={handleSubmit} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>
    </View>);
}
export default MoveOutRequestScreen;
