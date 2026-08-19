import { AppAlert } from "../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../app/navigation/navigation.types";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../shared/theme";
import { useCreateSos } from "../../emergency/data/useCreateSos";
import { styles } from "../styles/screens/SeniorSimpleModeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SeniorSimpleMode'>;
export function SeniorSimpleModeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { triggerSos } = useCreateSos();
    const handleSos = () => {
        AppAlert.alert(String(localizedUiText.m_9f3e55dd0b0f), String(localizedUiText.m_015e1a10a9a1), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_fabadd5b0408),
                onPress: async () => {
                    const inc = await triggerSos({ unitId: 'unit-b-0802', flatNumber: 'B-0802', tower: 'B Wing' });
                    navigation.navigate('ActiveEmergencyDetail', { incidentId: inc.id });
                }
            }
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{localizedUiText.m_7aa8aa65733c}</Text>
          <Pressable style={styles.exitBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.exitBtnText}>{localizedUiText.m_4855ea226d8c}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.sosBtn} onPress={handleSos}>
          <Ionicons name="notifications-circle" size={80} color={Colors.white}/>
          <Text style={styles.sosBtnText}>{localizedUiText.m_3fe8c679e336}</Text>
          <Text style={styles.sosBtnSub}>{localizedUiText.m_10e52b616163}</Text>
        </Pressable>

        <View style={styles.grid}>
          <Pressable style={styles.gridCard} onPress={() => navigation.navigate('SeniorDailyCheckIn')}>
            <Ionicons name="checkbox-outline" size={44} color={Colors.primary}/>
            <Text style={styles.cardLabel}>{localizedUiText.m_2b60696e1aac}</Text>
            <Text style={styles.cardSub}>{localizedUiText.m_af4b9750f54b}</Text>
          </Pressable>

          <Pressable style={styles.gridCard} onPress={() => AppAlert.alert(String(localizedUiText.m_6bcb7f66f9b9), String(localizedUiText.m_33add1b59627))}>
            <Ionicons name="call-outline" size={44} color={Colors.primary}/>
            <Text style={styles.cardLabel}>{localizedUiText.m_0e55e2eb2019}</Text>
            <Text style={styles.cardSub}>{localizedUiText.m_4c38f44e6e75}</Text>
          </Pressable>

          <Pressable style={styles.gridCard} onPress={() => AppAlert.alert(String(localizedUiText.m_789af1706249), String(localizedUiText.m_935846248bb6))}>
            <Ionicons name="shield-checkmark-outline" size={44} color={Colors.primary}/>
            <Text style={styles.cardLabel}>{localizedUiText.m_1557e693a9c9}</Text>
            <Text style={styles.cardSub}>{localizedUiText.m_3914b3caee6d}</Text>
          </Pressable>

          <Pressable style={styles.gridCard} onPress={() => AppAlert.alert(String(localizedUiText.m_abe6a4c44c16), String(localizedUiText.m_59b9e72e123f))}>
            <Ionicons name="help-circle-outline" size={44} color={Colors.primary}/>
            <Text style={styles.cardLabel}>{localizedUiText.m_eff15e9bf996}</Text>
            <Text style={styles.cardSub}>{localizedUiText.m_abe6a4c44c16}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

