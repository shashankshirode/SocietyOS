import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useCreateEmergencyIncident } from "../../data/useCreateEmergencyIncident";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/EmergencyConfirmationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyConfirmation'>;
export function EmergencyConfirmationScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { emergencyType } = route.params;
    const { createIncident, isSubmitting } = useCreateEmergencyIncident();
    const [confirmed, setConfirmed] = useState(false);
    const handleConfirm = async () => {
        if (!confirmed) {
            AppAlert.alert(String(localizedUiText.m_4850b174b713), String(localizedUiText.m_ff14c297c687));
            return;
        }
        try {
            const incident = await createIncident({
                emergencyType,
                severity: 'HIGH',
                location: 'Flat A-1204',
                description: formatUiLiteral(String(localizedUiText.m_facf1314df51), [emergencyType]),
            });
            AppAlert.alert(String(localizedUiText.m_0c914e1aafd7), String(localizedUiText.m_8fa1b4a0345b), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.replace('ActiveEmergencyDetail', { incidentId: incident.id }) }
            ]);
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_13ddd866499a));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="warning" size={48} color={Colors.danger}/>
        <Text style={styles.title}>{localizedUiText.m_a048c07d9b46}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_f9ba63151da3}{emergencyType}{localizedUiText.m_4902b3a8330e}</Text>

        <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
          </View>
          <Text style={styles.confirmText}>{localizedUiText.m_7e7c9551a873}</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]} onPress={handleConfirm} disabled={isSubmitting}>
          <Text style={styles.btnText}>{isSubmitting ? localizedUiText.m_94dc61379ec0 : localizedUiText.m_3063ed48efba}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

