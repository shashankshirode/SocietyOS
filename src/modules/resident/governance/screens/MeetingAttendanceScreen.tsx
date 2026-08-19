import { FlatList, Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { ParkingScreen } from "../../parking/components/ParkingUi";
import { useRepositoryResult } from "../../../../core/repositories/useRepositoryResult";
import { governanceRepository } from "../data/governance.repository";
import type { MeetingAttendanceScreenProps } from "../../../../app/navigation/navigation.types";
import type { MeetingAttendance } from "../../../../shared/types/governance.types";
import { styles, createViewWidthStyle } from "../styles/screens/MeetingAttendanceScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
const getAttendanceBadge = (status: string) => {
    const map: Record<string, 'success' | 'danger' | 'info' | 'warning'> = { PRESENT: 'success', ABSENT: 'danger', PROXY: 'info', LATE: 'warning' };
    return map[status] || 'neutral';
};
export function MeetingAttendanceScreen({ navigation, route }: MeetingAttendanceScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { meetingId } = route.params;
    const { data: attendance, isLoading, error, refetch } = useRepositoryResult(() => governanceRepository.getMeetingAttendance(meetingId), [meetingId]);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_3ba416a4782f} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    const present = attendance?.filter((a) => a.status === 'PRESENT').length ?? 0;
    const absent = attendance?.filter((a) => a.status === 'ABSENT').length ?? 0;
    const proxy = attendance?.filter((a) => a.status === 'PROXY').length ?? 0;
    const total = attendance?.length ?? 0;
    const quorumPercent = total > 0 ? Math.round(((present + proxy) / total) * 100) : 0;
    const renderItem = ({ item }: {
        item: MeetingAttendance;
    }) => (<View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.memberName.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.memberName}</Text>
        <Text style={styles.unit}>{item.memberUnit} · {item.memberRole}</Text>
        {item.proxyName && <Text style={styles.proxy}>{localizedUiText.m_ba7a1bcd1cb2 + " "}{item.proxyName}</Text>}
      </View>
      <StatusBadge label={item.status} type={getAttendanceBadge(item.status)}/>
    </View>);
    return (<ParkingScreen title={localizedUiText.m_4cecc708584f} subtitle={formatUiLiteral(localizedUiText.m_0d341efcdd42, [present + proxy, total])} onBack={navigation.goBack}>
      <View style={styles.summary}>
        <View style={styles.quorumBar}><View style={[styles.quorumFill, createViewWidthStyle(`${Math.min(quorumPercent, 100)}%`)]}/></View>
        <Text style={styles.quorumText}>{localizedUiText.m_2e5dd7a65da5 + " "}{quorumPercent}%</Text>
        <View style={styles.counters}>
          <View style={[styles.counterDot, styles.viewBackgroundColor]}/><Text style={styles.counterText}>{localizedUiText.m_b482f1b7a527 + " "}{present}</Text>
          <View style={[styles.counterDot, styles.viewBackgroundColor2]}/><Text style={styles.counterText}>{localizedUiText.m_ba7a1bcd1cb2 + " "}{proxy}</Text>
          <View style={[styles.counterDot, styles.viewBackgroundColor3]}/><Text style={styles.counterText}>{localizedUiText.m_526d5e25cad5 + " "}{absent}</Text>
        </View>
      </View>

      <FlatList data={attendance ?? []} keyExtractor={(item) => item.id} renderItem={renderItem} scrollEnabled={false} ListEmptyComponent={<Text style={styles.emptyText}>{localizedUiText.m_dd181337f09e}</Text>}/>
    </ParkingScreen>);
}

