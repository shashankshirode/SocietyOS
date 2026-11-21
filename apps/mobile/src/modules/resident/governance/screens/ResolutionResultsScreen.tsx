import { Text, View } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge, getResolutionStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { DetailCard, ParkingScreen } from "../../parking/components/ParkingUi";
import { useResolutionDetail } from "../data/useResolutionDetail";
import { useRepositoryResult } from "../../../../core/repositories/useRepositoryResult";
import { governanceRepository } from "../data/governance.repository";
import type { ResolutionResultsScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createTextColorStyle, createViewWidthBackgroundColorStyle } from "../styles/screens/ResolutionResultsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function ResolutionResultsScreen({ navigation, route }: ResolutionResultsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { resolutionId } = route.params;
    const { data: resolution, isLoading, error, refetch } = useResolutionDetail(resolutionId);
    const { data: votes } = useRepositoryResult(() => governanceRepository.getResolutionVotes(resolutionId), [resolutionId]);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_b00da16333ce} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!resolution)
        return <ErrorState message={localizedUiText.m_a63d8560cd69} onRetry={refetch}/>;
    const totalVotes = resolution.votesFor + resolution.votesAgainst + resolution.votesAbstained;
    const forPct = totalVotes > 0 ? Math.round((resolution.votesFor / totalVotes) * 100) : 0;
    const againstPct = totalVotes > 0 ? Math.round((resolution.votesAgainst / totalVotes) * 100) : 0;
    const abstainPct = totalVotes > 0 ? Math.round((resolution.votesAbstained / totalVotes) * 100) : 0;
    const totalEligibleVoters = resolution.totalEligibleVoters ?? 0;
    const participation = totalEligibleVoters > 0 ? Math.round((totalVotes / totalEligibleVoters) * 100) : 0;
    return (<ParkingScreen title={localizedUiText.m_8618db5642cc} subtitle={resolution.resolutionNumber} onBack={navigation.goBack}>
      <View style={styles.statusRow}>
        <StatusBadge label={resolution.status.replace(/_/g, ' ')} type={getResolutionStatusBadgeType(resolution.status)}/>
        <Text style={styles.resTitle} numberOfLines={2}>{resolution.title}</Text>
      </View>

      <DetailCard title={localizedUiText.m_2ce780016ea7}>
        {[{ label: String(localizedUiText.m_ca15ebc05a3c), count: resolution.votesFor, pct: forPct, color: Colors.success },
            { label: String(localizedUiText.m_101a944bd45f), count: resolution.votesAgainst, pct: againstPct, color: Colors.danger },
            { label: String(localizedUiText.m_bf92ab42d052), count: resolution.votesAbstained, pct: abstainPct, color: Colors.neutral },
        ].map((v) => (<View key={v.label} style={styles.barRow}>
            <Text style={[styles.barLabel, createTextColorStyle(v.color)]}>{v.label}</Text>
            <View style={styles.barTrack}><View style={[styles.barFill, createViewWidthBackgroundColorStyle(`${v.pct}%`, v.color)]}/></View>
            <Text style={styles.barValue}>{v.count} ({v.pct}%)</Text>
          </View>))}
      </DetailCard>

      <DetailCard title={localizedUiText.m_8e76a94ac832}>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_d759f38027c0}</Text><Text style={styles.value}>{totalVotes}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_4f85799f122a}</Text><Text style={styles.value}>{totalEligibleVoters}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_73e0212c5086}</Text><Text style={styles.value}>{participation}%</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_6c4a6a7fc237}</Text><Text style={styles.value}>{resolution.requiredMajority}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_6e7d50e84f47}</Text><StatusBadge label={resolution.status === 'PASSED' ? localizedUiText.m_e5a0eb01db90 : resolution.status === 'REJECTED' ? localizedUiText.m_04cc0e71ffcf : localizedUiText.m_331551b0de41} type={getResolutionStatusBadgeType(resolution.status)}/></View>
      </DetailCard>

      {votes && votes.length > 0 && (<DetailCard title={formatUiLiteral(localizedUiText.m_24c48bfae406, [votes.length])}>
          {votes.slice(0, 5).map((vote) => (<View key={vote.id} style={styles.voteRow}>
              <Text style={styles.voterName}>{vote.voterName} ({vote.voterUnit})</Text>
              <StatusBadge label={vote.choice} type={vote.choice === 'FOR' ? 'success' : vote.choice === 'AGAINST' ? 'danger' : 'neutral'}/>
            </View>))}
        </DetailCard>)}
    </ParkingScreen>);
}

