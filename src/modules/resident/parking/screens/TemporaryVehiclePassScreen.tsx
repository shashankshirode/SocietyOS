import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { VisitorPassPanel } from "../../../../ui/patterns/VisitorPassPanel";
import { FormField } from "../../../../shared/forms/FormField";
import { AppButton } from "../../../../shared/components/AppButton";
import { useTemporaryVehiclePass } from "../hooks/useTemporaryVehiclePass";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/TemporaryVehiclePassScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function TemporaryVehiclePassScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { submit, isSubmitting } = useTemporaryVehiclePass();
    const [created, setCreated] = useState(false);
    const [form, setForm] = useState({
        vehicleNumber: '',
        driverName: '',
        durationDays: '1',
    });
    const handleCreate = async () => {
        if (!form.vehicleNumber.trim()) {
            AppAlert.alert(String(localizedUiText.m_4850b174b713), String(localizedUiText.m_e1d04f0f4b31));
            return;
        }
        const res = await submit({
            vehicleNumber: form.vehicleNumber,
            driverName: form.driverName,
            durationDays: parseInt(form.durationDays, 10),
        });
        if (res.ok) {
            setCreated(true);
            AppAlert.alert(String(localizedUiText.m_7432647e953f), String(localizedUiText.m_a902fce20aeb));
        }
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_256abeda81af}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {created ? (<VisitorPassPanel visitorName={form.vehicleNumber} visitorType="Guest Vehicle Pass" purpose={String(localizedUiText.m_6494690a5ff8)} validFrom="Today" validTill={`Next ${form.durationDays} day(s)`} gateName="Main Gate" otpCode="8801"/>) : (<View style={styles.form}>
            <FormField label={localizedUiText.m_f3d04f43d049} value={form.vehicleNumber} onChangeText={(val) => setForm({ ...form, vehicleNumber: val })} placeholder={localizedUiText.m_949f403fa432}/>
            <FormField label={localizedUiText.m_28f9e3229a53} value={form.driverName} onChangeText={(val) => setForm({ ...form, driverName: val })} placeholder={localizedUiText.m_a02c7b55675c}/>
            <FormField label={localizedUiText.m_d484da37566f} value={form.durationDays} onChangeText={(val) => setForm({ ...form, durationDays: val })} placeholder={localizedUiText.m_b1fd798deb7a} keyboardType="number-pad"/>

            <View style={styles.viewMarginTop}>
              <AppButton title={localizedUiText.m_e89f1e4ce1ff} onPress={handleCreate} loading={isSubmitting} iconLeft={<Ionicons name="qr-code-outline" size={18} color="#FFFFFF"/>}/>
            </View>
          </View>)}
      </ScrollView>
    </View>);
}
export default TemporaryVehiclePassScreen;

