import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useVolunteerAlertDetail } from "../../data/useVolunteerAlertDetail";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import type { Absent } from "../../../../../shared/types/absence.types";
import { styles } from "../../styles/screens/safety_screens/VolunteerAlertDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'VolunteerAlertDetail'>;
export function VolunteerAlertDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { alertId } = route.params;
    const { data, isLoading, error, accept, decline, refetch } = useVolunteerAlertDetail(alertId);
    const handleAccept = () => {
        AppAlert.prompt(String(localizedUiText.m_96f76e8a02f6), getActiveUiLiteral("m_776726007607"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_96f76e8a02f6),
                onPress: async (note: string | Absent) => {
                    await accept(note || getActiveUiLiteral("m_746272fdca49"));
                    AppAlert.alert(String(localizedUiText.m_8b2d0675b4b0), String(localizedUiText.m_a47e46e3aaa1));
                    void refetch();
                }
            }
        ]);
    };
    const handleDecline = () => {
        AppAlert.prompt(String(localizedUiText.m_f84644f8a82d), getActiveUiLiteral("m_b2b01a203060"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_a2d285b35287),
                onPress: async (note: string | Absent) => {
                    await decline(note || 'Unavailable.');
                    AppAlert.alert(String(localizedUiText.m_dce083a2c47f), String(localizedUiText.m_a2bc84404e29));
                    void refetch();
                }
            }
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_594d898c7cb9}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_1cb1c54427ac}/>;
    const alertVal = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Ionicons name="notifications" size={48} color={Colors.danger}/>
          <Text style={styles.title}>{alertVal.emergencyType}{" " + localizedUiText.m_b44045776d5f}</Text>
          <Text style={styles.loc}>{localizedUiText.m_bbdffe25dc7d + " "}{alertVal.location}</Text>
          <Text style={styles.severity}>{localizedUiText.m_ce9bf63abbec + " "}{alertVal.severity}</Text>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instTitle}>{localizedUiText.m_7f01c82a5da5}</Text>
          <Text style={styles.instText}>{localizedUiText.m_4aee867370a9}</Text>
        </View>

        {alertVal.status === 'PENDING' && (<View style={styles.actions}>
            <Pressable style={styles.btn} onPress={handleAccept}>
              <Text style={styles.btnText}>{localizedUiText.m_f2ff68281795}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSec]} onPress={handleDecline}>
              <Text style={styles.btnTextSec}>{localizedUiText.m_047f73fe9a1c}</Text>
            </Pressable>
          </View>)}
      </ScrollView>
    </ScreenContainer>);
}

