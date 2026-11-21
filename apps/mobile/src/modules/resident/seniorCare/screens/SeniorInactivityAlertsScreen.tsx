import { AppAlert } from "../../../../ui/modal/AppAlert";
import { Text, View, FlatList, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../app/navigation/navigation.types";
import { useSeniorInactivityAlerts } from "../../emergency/data/useSeniorInactivityAlerts";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles } from "../styles/screens/SeniorInactivityAlertsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SeniorInactivityAlerts'>;
export function SeniorInactivityAlertsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, acknowledgeAlert, escalateAlert, refetch } = useSeniorInactivityAlerts();
    const handleAcknowledge = (id: string, name: string) => {
        AppAlert.prompt(String(localizedUiText.m_13b621aec2cd), formatUiLiteral(String(localizedUiText.m_bad69facde91), [name]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_59553a67f9fe),
                onPress: async (notes: string | Absent) => {
                    await acknowledgeAlert(id, notes || getActiveUiLiteral("m_1e23a5f2d94c"));
                    AppAlert.alert(String(localizedUiText.m_d87cdf8aa304), String(localizedUiText.m_e02b42dcd542));
                }
            }
        ]);
    };
    const handleEscalate = (id: string, name: string) => {
        AppAlert.alert(String(localizedUiText.m_262864fb2a60), formatUiLiteral(String(localizedUiText.m_fbfe7694e237), [name]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_dfa8345eead6),
                onPress: async () => {
                    await escalateAlert(id, getActiveUiLiteral("m_071218ec63af"));
                    AppAlert.alert(String(localizedUiText.m_b710aaaaa7ba), String(localizedUiText.m_e9b05bd6c937));
                }
            }
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c3bf91216b42}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} contentContainerStyle={styles.scroll} renderItem={({ item }) => (<View style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.name}>{item.seniorName}</Text>
                <Text style={styles.flat}>{item.tower} {item.flatNumber}</Text>
              </View>
              <StatusBadge status={item.alertStatus} moduleType="parking"/>
            </View>

            <View style={styles.details}>
              <Text style={styles.detailText}>{localizedUiText.m_7e6a317be590 + " "}{formatResidentTime(item.missedCheckInTime)}</Text>
              <Text style={styles.detailText}>{localizedUiText.m_eb5305705cb6 + " "}{item.familyNotified ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}</Text>
              <Text style={styles.detailText}>{localizedUiText.m_186d6adff2df + " "}{item.securityCheckCallStatus}</Text>
            </View>

            {item.alertStatus === 'OPEN' && (<View style={styles.actions}>
                <Pressable style={styles.btn} onPress={() => handleAcknowledge(item.id, item.seniorName)}>
                  <Text style={styles.btnText}>{localizedUiText.m_f9236d9e87b6}</Text>
                </Pressable>
                <Pressable style={[styles.btn, styles.btnEsc]} onPress={() => handleEscalate(item.id, item.seniorName)}>
                  <Text style={styles.btnText}>{localizedUiText.m_d563aaf7079b}</Text>
                </Pressable>
              </View>)}
          </View>)} ListHeaderComponent={<View style={styles.listHeader}>
            <Text style={styles.title}>{localizedUiText.m_99c7e8251e1a}</Text>
            <Text style={styles.subtitle}>{localizedUiText.m_9f0169599203}</Text>
          </View>} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_585ab6ddabdc}</Text>
          </View>}/>
    </ScreenContainer>);
}

