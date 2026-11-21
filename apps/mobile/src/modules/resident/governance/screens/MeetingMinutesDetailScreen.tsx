import { Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { AppButton } from "../../../../shared/components/AppButton";
import { DetailCard, ParkingScreen } from "../../parking/components/ParkingUi";
import { useMeetingMinutes } from "../data/useMeetingMinutes";
import { useAcknowledgeMeetingMinutes } from "../data/useAcknowledgeMeetingMinutes";
import type { MeetingMinutesDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { styles } from "../styles/screens/MeetingMinutesDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function MeetingMinutesDetailScreen({ navigation, route }: MeetingMinutesDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { meetingId } = route.params;
    const { data: minutes, isLoading, error, refetch } = useMeetingMinutes(meetingId);
    const acknowledgment = useAcknowledgeMeetingMinutes();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_c90309ad5999} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!minutes)
        return <ErrorState message={localizedUiText.m_7a68885a1964} onRetry={refetch}/>;
    const keyDecisions = minutes.keyDecisions ?? [];
    const attendanceSummary = minutes.attendanceSummary ?? {
        totalMembers: 0,
        present: 0,
        absent: 0,
        proxy: 0,
        quorumMet: false,
    };
    const handleAcknowledge = async () => {
        const result = await acknowledgment.submit(minutes.id);
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_2000809fa181), result.error.message);
            return;
        }
        await refetch();
        AppAlert.alert(String(localizedUiText.m_043799e25c00), String(localizedUiText.m_b94c5a1dd5e0));
    };
    return (<ParkingScreen title={localizedUiText.m_a20d95269b18} subtitle={minutes.meetingTitle} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_8e76a94ac832}>
        <Text style={styles.summary}>{minutes.summary}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {formatResidentDate(minutes.meetingDate)}</Text>
          <Text style={styles.metaText}>✍️ {minutes.preparedBy}</Text>
        </View>
        {minutes.approvedBy && <Text style={styles.approvedText}>{localizedUiText.m_681761fb0fd3 + " "}{minutes.approvedBy}</Text>}
      </DetailCard>

      <DetailCard title={localizedUiText.m_ebfe45997fb9}>
        {keyDecisions.map((decision, i) => (<View key={i} style={styles.decisionRow}>
            <View style={styles.bullet}/>
            <Text style={styles.decisionText}>{decision}</Text>
          </View>))}
      </DetailCard>

      <DetailCard title={localizedUiText.m_20965cdee97a}>
        {minutes.actionItems.map((item) => (<View key={item.id} style={styles.actionRow}>
            <View style={styles.actionHeader}>
              <Text style={styles.actionDesc} numberOfLines={2}>{item.description}</Text>
              <StatusBadge label={item.status} type={item.status === 'COMPLETED' ? 'success' : item.status === 'OVERDUE' ? 'danger' : item.status === 'IN_PROGRESS' ? 'warning' : 'neutral'}/>
            </View>
            <Text style={styles.actionMeta}>{localizedUiText.m_0e3965218de0 + " "}{item.assignee}{" " + localizedUiText.m_97ac98e6e401 + " "}{formatResidentDate(item.dueDate)}</Text>
          </View>))}
      </DetailCard>

      <DetailCard title={localizedUiText.m_b6fb0a20be38}>
        <View style={styles.attGrid}>
          <View style={styles.attCell}><Text style={styles.attNum}>{attendanceSummary.totalMembers}</Text><Text style={styles.attLabel}>{localizedUiText.m_c9b3c38247f7}</Text></View>
          <View style={styles.attCell}><Text style={[styles.attNum, styles.textColor]}>{attendanceSummary.present}</Text><Text style={styles.attLabel}>{localizedUiText.m_43f9b89c0b9d}</Text></View>
          <View style={styles.attCell}><Text style={[styles.attNum, styles.textColor2]}>{attendanceSummary.absent}</Text><Text style={styles.attLabel}>{localizedUiText.m_84fd36f7cbff}</Text></View>
          <View style={styles.attCell}><Text style={[styles.attNum, styles.textColor3]}>{attendanceSummary.proxy}</Text><Text style={styles.attLabel}>{localizedUiText.m_a68ee4167406}</Text></View>
        </View>
        <StatusBadge label={attendanceSummary.quorumMet ? localizedUiText.m_ed5777cd57e7 : localizedUiText.m_c39bb1ead58d} type={attendanceSummary.quorumMet ? 'success' : 'danger'} style={styles.statusBadgeAlignSelfMarginTop}/>
      </DetailCard>

      {minutes.acknowledged && <Text style={styles.acknowledgedText}>{localizedUiText.m_84d68ba1cb72 + " "}{minutes.acknowledgedAt ? formatResidentDate(minutes.acknowledgedAt) : localizedUiText.m_fe95439487d8}</Text>}
      {!minutes.acknowledged && (<View style={styles.acknowledgmentPanel}>
          <Text style={styles.pendingText}>{localizedUiText.m_5072467945ec}</Text>
          <AppButton title={localizedUiText.m_9ff10c7c1da0} onPress={() => void handleAcknowledge()} loading={acknowledgment.isSubmitting}/>
        </View>)}
    </ParkingScreen>);
}

