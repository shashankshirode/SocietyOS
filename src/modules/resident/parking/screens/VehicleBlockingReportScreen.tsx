import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentWorkflowStepper } from "../../../../ui/patterns/ResidentWorkflowStepper";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useCreateParkingIncident } from "../data/useCreateParkingIncident";
import type { VehicleBlockingReportScreenProps } from "../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorStyle, createViewBorderColorBackgroundColorStyle, createViewBorderColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/VehicleBlockingReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
const STEPS = ['Details', 'Evidence', 'Submit'];
export function VehicleBlockingReportScreen({ navigation, route }: VehicleBlockingReportScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { submit, isSubmitting } = useCreateParkingIncident();
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState({
        yourVehicleNumber: '',
        blockingVehicleNumber: '',
        location: '',
        description: '',
        immediateHelp: true,
        photoAttached: false
    });
    const nextStep = () => {
        if (stepIndex === 0 && (!form.yourVehicleNumber || !form.location)) {
            AppAlert.alert(String(localizedUiText.m_74835b2b1e73), String(localizedUiText.m_d38a587b74a9));
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
    const handleSubmit = async () => {
        const res = await submit({
            societyId: 'society-001',
            unitId: route.params.unitId,
            issueType: 'BLOCKING_EXIT',
            ...includeWhenPresent("vehicleNumber", form.blockingVehicleNumber || undefined),
            location: form.location,
            description: form.description,
            priority: form.immediateHelp ? 'URGENT' : 'HIGH',
            reportedBy: 'Shashank',
            reportedFlat: 'A-1204',
            immediateSecurityHelp: form.immediateHelp
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_8ca47eb028ff), String(localizedUiText.m_4ae5a8c4b141), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.replace('ParkingIncidentDetail', { incidentId: res.data.id }) },
            ]);
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_d06a83b1c41c} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_efeda1c2e77b}</SafeText>
            <FormField label={localizedUiText.m_5527cdacb07c} value={form.yourVehicleNumber} onChangeText={(val) => setForm({ ...form, yourVehicleNumber: val })} placeholder={localizedUiText.m_949f403fa432}/>
            <FormField label={localizedUiText.m_a8580ce14752} value={form.blockingVehicleNumber} onChangeText={(val) => setForm({ ...form, blockingVehicleNumber: val })} placeholder={localizedUiText.m_a06ba4fb3d88}/>
            <FormField label={localizedUiText.m_acbc7a564f40} value={form.location} onChangeText={(val) => setForm({ ...form, location: val })} placeholder={localizedUiText.m_556b56344599}/>
            <FormField label={localizedUiText.m_0ce0cc72bb48} value={form.description} onChangeText={(val) => setForm({ ...form, description: val })} placeholder={localizedUiText.m_01aaff8d012c} multiline numberOfLines={3}/>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_1fdfbd04883e}</SafeText>
            <SafeText variant="caption" color="muted">{localizedUiText.m_855b1d639eb8}</SafeText>

            <View style={styles.evidenceGrid}>
              <PressableScale onPress={() => setForm({ ...form, photoAttached: true })} style={styles.pressableScaleFlex}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
                  <Ionicons name="camera-outline" size={26} color={theme.accent}/>
                  <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textPrimary)}>
                    {form.photoAttached ? localizedUiText.m_5bc9d65911dc : localizedUiText.m_3c3b38c88cb0}
                  </SafeText>
                </View>
              </PressableScale>
            </View>
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_689e5063b9ea}</SafeText>

            <View style={[styles.switchRow, createViewBorderColorStyle(theme.border)]}>
              <View style={styles.switchText}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_92ec94d5dc73}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.textSecondary)}>{localizedUiText.m_4e2aac177754}</SafeText>
              </View>
              <Switch value={form.immediateHelp} onValueChange={(val) => setForm({ ...form, immediateHelp: val })} trackColor={{ false: theme.border, true: theme.accent }}/>
            </View>
          </View>)}
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={localizedUiText.m_ffc942eaaa57} onPress={handleSubmit} loading={isSubmitting} iconLeft={<Ionicons name="shield-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>
    </View>);
}
export default VehicleBlockingReportScreen;

