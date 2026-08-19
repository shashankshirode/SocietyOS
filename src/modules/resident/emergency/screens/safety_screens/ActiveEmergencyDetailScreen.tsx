import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useActiveEmergencyDetail } from "../../data/useActiveEmergencyDetail";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { StatusBadge } from "../../../../../shared/components/StatusBadge";
import { ResponderStatusCard } from "../../components/ResponderStatusCard";
import { emergencySafetyRepository } from "../../data/emergencySafety.repository";
import { formatResidentDateTime } from "../../../../../core/localization/dateTimeFormatters";
import { styles } from "../../styles/screens/safety_screens/ActiveEmergencyDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'ActiveEmergencyDetail'>;
export function ActiveEmergencyDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { incidentId } = route.params;
    const { data, isLoading, error, refetch } = useActiveEmergencyDetail(incidentId);
    const handleMarkSafe = () => {
        AppAlert.alert(String(localizedUiText.m_d48780bdf55c), String(localizedUiText.m_ffac36c087fd), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_2a8709babf0e),
                onPress: async () => {
                    await emergencySafetyRepository.markResidentSafe(incidentId, { note: getActiveUiLiteral("m_4046fe2575fc") });
                    AppAlert.alert(String(localizedUiText.m_8b2d0675b4b0), String(localizedUiText.m_f0b82a202cc1));
                    void refetch();
                }
            }
        ]);
    };
    const handleClose = () => {
        AppAlert.prompt(String(localizedUiText.m_311c054b9cb2), getActiveUiLiteral("m_32c0342524e6"), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_311c054b9cb2),
                onPress: async (summary?: string) => {
                    if (!summary?.trim()) {
                        AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_f5c24e24fa93));
                        return;
                    }
                    await emergencySafetyRepository.closeIncident(incidentId, { closureSummary: summary });
                    AppAlert.alert(String(localizedUiText.m_0ec810a05bce), String(localizedUiText.m_2b10c0fd8676));
                    void refetch();
                }
            }
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c16b7e2b4487}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_8339d68be93b}/>;
    const incident = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.incNum}>{incident.incidentNumber}</Text>
            <StatusBadge status={incident.status} moduleType="parking"/>
          </View>
          <Text style={styles.typeTitle}>{incident.emergencyType}{" " + localizedUiText.m_44a57b22e03d}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={16} color={Colors.danger}/> {incident.location}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_5399573c2929}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_b8c1a8dcd16c}</Text>
              <Text style={styles.val}>{incident.reportedByUserName} ({incident.reportedByUserMobileMasked})</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_5f0def4ddbfb}</Text>
              <Text style={styles.val}>{formatResidentDateTime(incident.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_5e9f98120dbe}</Text>
              <Text style={[styles.val, styles.dangerText]}>{incident.severity}</Text>
            </View>
            {incident.description && (<View style={styles.descBox}>
                <Text style={styles.label}>{localizedUiText.m_526e0087cc3f}</Text>
                <Text style={styles.descText}>{incident.description}</Text>
              </View>)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{localizedUiText.m_5fcee794b159}{incident.responders.length})</Text>
          </View>
          {incident.responders.length === 0 ? (<Text style={styles.emptyText}>{localizedUiText.m_63112d64f6cf}</Text>) : (incident.responders.map((r) => (<ResponderStatusCard key={r.id} responder={r}/>)))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_ff8059dc6752}</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionBtn} onPress={() => navigation.navigate('EmergencyIncidentTimeline', { incidentId })}>
              <Ionicons name="time-outline" size={18} color={Colors.white}/>
              <Text style={styles.actionBtnText}>{localizedUiText.m_94cd0f19714a}</Text>
            </Pressable>

            {incident.status !== 'CLOSED' && incident.status !== 'UNDER_CONTROL' && (<Pressable style={[styles.actionBtn, styles.safeBtn]} onPress={handleMarkSafe}>
                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white}/>
                <Text style={styles.actionBtnText}>{localizedUiText.m_3f32a16a6ec3}</Text>
              </Pressable>)}

            {incident.status !== 'CLOSED' && (<Pressable style={[styles.actionBtn, styles.closeBtn]} onPress={handleClose}>
                <Ionicons name="close-circle-outline" size={18} color={Colors.white}/>
                <Text style={styles.actionBtnText}>{localizedUiText.m_311c054b9cb2}</Text>
              </Pressable>)}

          </View>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

