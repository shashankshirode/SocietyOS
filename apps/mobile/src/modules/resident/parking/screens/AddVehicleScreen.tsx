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
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAddVehicle } from "../data/useAddVehicle";
import type { AddVehicleScreenProps } from "../../../../app/navigation/navigation.types";
import type { VehicleType } from "../../../../shared/types/vehicle.types";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBorderColorBackgroundColorStyle, createViewPaddingBottomBorderTopColorStyle } from "../styles/screens/AddVehicleScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
const STEPS = ['Type', 'Details', 'Proof'];
export function AddVehicleScreen({ navigation, route }: AddVehicleScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { unitId } = route.params;
    const { submit, isSubmitting } = useAddVehicle();
    const [stepIndex, setStepIndex] = useState(0);
    const [form, setForm] = useState({
        vehicleType: 'CAR' as VehicleType,
        vehicleNumber: '',
        makeModel: '',
        color: '',
        ownerName: 'Shashank Shirode',
        hasDoc: false
    });
    const nextStep = () => {
        if (stepIndex === 1 && (!form.vehicleNumber || !form.makeModel)) {
            AppAlert.alert(String(localizedUiText.m_74835b2b1e73), String(localizedUiText.m_1041548c0d38));
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
            unitId,
            vehicleType: form.vehicleType,
            vehicleNumber: form.vehicleNumber,
            makeModel: form.makeModel,
            color: form.color,
            fuelType: 'PETROL',
            ownerName: form.ownerName,
            linkedResidentName: 'Shashank'
        });
        if (res.ok) {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_9ab4a99dab54), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.replace('VehicleDetail', { vehicleId: res.data.id }) },
            ]);
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_f10cf1da4518} {...includeWhenPresent("onBackPress", stepIndex > 0 ? prevStep : undefined)}/>
      <ResidentWorkflowStepper steps={STEPS} currentStepIndex={stepIndex}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stepIndex === 0 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_817a6f5c96b4}</SafeText>
            <View style={styles.grid}>
              <PressableScale onPress={() => setForm({ ...form, vehicleType: 'CAR' })} style={styles.gridItem}>
                <View style={[
                styles.catCard,
                createViewBackgroundColorBorderColorStyle(form.vehicleType === 'CAR' ? theme.accent : theme.surface, form.vehicleType === 'CAR' ? 'transparent' : theme.border),
            ]}>
                  <Ionicons name="car-outline" size={24} color={form.vehicleType === 'CAR' ? '#FFFFFF' : theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle2(form.vehicleType === 'CAR' ? '#FFFFFF' : theme.textPrimary)}>{localizedUiText.m_4e68d2c6683c}</SafeText>
                </View>
              </PressableScale>

              <PressableScale onPress={() => setForm({ ...form, vehicleType: 'TWO_WHEELER' })} style={styles.gridItem}>
                <View style={[
                styles.catCard,
                createViewBackgroundColorBorderColorStyle2(form.vehicleType === 'TWO_WHEELER' ? theme.accent : theme.surface, form.vehicleType === 'TWO_WHEELER' ? 'transparent' : theme.border),
            ]}>
                  <Ionicons name="bicycle-outline" size={24} color={form.vehicleType === 'TWO_WHEELER' ? '#FFFFFF' : theme.accent}/>
                  <SafeText variant="caption" style={createSafeTextColorStyle3(form.vehicleType === 'TWO_WHEELER' ? '#FFFFFF' : theme.textPrimary)}>{localizedUiText.m_836874fa98f8}</SafeText>
                </View>
              </PressableScale>
            </View>
          </View>)}

        {stepIndex === 1 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{localizedUiText.m_e1f8540b9b3d}</SafeText>
            <FormField label={localizedUiText.m_57c8177ac1f3} value={form.vehicleNumber} onChangeText={(val) => setForm({ ...form, vehicleNumber: val })} placeholder={localizedUiText.m_a06ba4fb3d88}/>
            <FormField label={localizedUiText.m_7532cfd9fe94} value={form.makeModel} onChangeText={(val) => setForm({ ...form, makeModel: val })} placeholder={localizedUiText.m_a6b09c56482d}/>
            <FormField label={localizedUiText.m_6b73191a0a4b} value={form.color} onChangeText={(val) => setForm({ ...form, color: val })} placeholder={localizedUiText.m_8bf6fb0385e9}/>
          </View>)}

        {stepIndex === 2 && (<View style={styles.formContainer}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle5(theme.textPrimary)}>{localizedUiText.m_e2a01d3a3d09}</SafeText>
            <SafeText variant="caption" color="muted">{localizedUiText.m_b0c6800ca437}</SafeText>

            <View style={styles.evidenceGrid}>
              <PressableScale onPress={() => setForm({ ...form, hasDoc: true })} style={styles.pressableScaleFlex}>
                <View style={[styles.evidenceBox, createViewBorderColorBackgroundColorStyle(theme.border, theme.surface)]}>
                  <Ionicons name="cloud-upload-outline" size={24} color={theme.accent}/>
                  <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.textPrimary)}>
                    {form.hasDoc ? localizedUiText.m_a197b7f7f1f1 : localizedUiText.m_842141adb478}
                  </SafeText>
                </View>
              </PressableScale>
            </View>
          </View>)}
      </ScrollView>

      
      <View style={[styles.bottomBar, createViewPaddingBottomBorderTopColorStyle(insets.bottom + 12, theme.border)]}>
        {stepIndex < STEPS.length - 1 ? (<AppButton title={localizedUiText.m_226366c3301a} onPress={nextStep} iconRight={<Ionicons name="arrow-forward-outline" size={18} color="#FFFFFF"/>}/>) : (<AppButton title={localizedUiText.m_767f6bb120f8} onPress={handleSubmit} loading={isSubmitting} iconLeft={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF"/>}/>)}
      </View>
    </View>);
}
export default AddVehicleScreen;

