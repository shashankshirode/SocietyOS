import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useCreateSos } from "../../data/useCreateSos";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/SosQuickActionScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SosQuickAction'>;
export function SosQuickActionScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { triggerSos, isSubmitting } = useCreateSos();
    const handleTrigger = async () => {
        try {
            const incident = await triggerSos({
                unitId: 'unit-a-1204',
                flatNumber: 'A-1204',
                tower: 'A Wing',
                note: getActiveUiLiteral("m_24a966a81f39")
            });
            AppAlert.alert(String(localizedUiText.m_bd496f0cbd9a), String(localizedUiText.m_d7bd0643cb43), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.replace('ActiveEmergencyDetail', { incidentId: incident.id }),
                }
            ]);
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_bb3b5f4e7d3d));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="notifications-circle" size={100} color={Colors.danger}/>
        <Text style={styles.title}>{localizedUiText.m_9bb24d2627de}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_4aeb41bb53a5}</Text>

        <Pressable style={({ pressed }) => [styles.triggerBtn, pressed && styles.pressed]} onPress={handleTrigger} disabled={isSubmitting}>
          <Text style={styles.triggerText}>{isSubmitting ? localizedUiText.m_ab59599442f8 : localizedUiText.m_f2114c865b71}</Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>{localizedUiText.m_19766ed6ccb2}</Text>
        </Pressable>

        <Text style={styles.disclaimer}>{localizedUiText.m_8e6373cbed44}</Text>
      </View>
    </ScreenContainer>);
}

