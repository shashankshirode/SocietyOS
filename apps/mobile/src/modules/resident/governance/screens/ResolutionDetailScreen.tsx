import { Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge, getResolutionStatusBadgeType, getVoteStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { ActionTile, DetailCard, ParkingScreen } from "../../parking/components/ParkingUi";
import { useResolutionDetail } from "../data/useResolutionDetail";
import type { ResolutionDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createViewWidthStyle, createViewWidthStyle2, createViewWidthStyle3 } from "../styles/screens/ResolutionDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function ResolutionDetailScreen({ navigation, route }: ResolutionDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { resolutionId } = route.params;
    const { data: resolution, isLoading, error, refetch } = useResolutionDetail(resolutionId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_a4aa0aacf5ac} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!resolution)
        return <ErrorState message={localizedUiText.m_a63d8560cd69} onRetry={refetch}/>;
    const totalVotes = resolution.votesFor + resolution.votesAgainst + resolution.votesAbstained;
    const forPercent = totalVotes > 0 ? Math.round((resolution.votesFor / totalVotes) * 100) : 0;
    const againstPercent = totalVotes > 0 ? Math.round((resolution.votesAgainst / totalVotes) * 100) : 0;
    const abstainPercent = totalVotes > 0 ? Math.round((resolution.votesAbstained / totalVotes) * 100) : 0;
    return (<ParkingScreen title={resolution.resolutionNumber} subtitle={resolution.title} onBack={navigation.goBack}>
      <View style={styles.statusRow}>
        <StatusBadge label={resolution.status.replace(/_/g, ' ')} type={getResolutionStatusBadgeType(resolution.status)}/>
        <View style={styles.typeChip}><Text style={styles.typeText}>{resolution.type}</Text></View>
        {resolution.myVote && <StatusBadge label={formatUiLiteral(localizedUiText.m_c8bd61fa8e20, [resolution.myVote])} type={getVoteStatusBadgeType('VOTED')}/>}
      </View>

      <DetailCard title={localizedUiText.m_e8e879c98cfb}>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_e0ec57413e72}</Text><Text style={styles.value}>{resolution.proposerName} ({resolution.proposerUnit})</Text></View>
        {resolution.seconderName && <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_54d882cadd9c}</Text><Text style={styles.value}>{resolution.seconderName} ({resolution.seconderUnit})</Text></View>}
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_6c4a6a7fc237}</Text><Text style={styles.value}>{resolution.requiredMajority}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_4f85799f122a}</Text><Text style={styles.value}>{resolution.totalEligibleVoters}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>{localizedUiText.m_8b8b8871bbfb}</Text><Text style={styles.value} numberOfLines={1}>{resolution.meetingTitle}</Text></View>
      </DetailCard>

      <Text style={styles.sectionTitle}>{localizedUiText.m_b6127f200afb}</Text>
      <Text style={styles.fullText}>{resolution.fullText}</Text>

      {totalVotes > 0 && (<DetailCard title={localizedUiText.m_c954c72420e5}>
          <View style={styles.voteBar}>
            <View style={[styles.voteFill, createViewWidthStyle(`${forPercent}%`)]}/>
            <View style={[styles.voteFill, createViewWidthStyle2(`${againstPercent}%`)]}/>
            <View style={[styles.voteFill, createViewWidthStyle3(`${abstainPercent}%`)]}/>
          </View>
          <View style={styles.voteLegend}>
            <Text style={[styles.voteText, styles.textColor]}>{localizedUiText.m_b7f3fbd418df + " "}{resolution.votesFor} ({forPercent}%)</Text>
            <Text style={[styles.voteText, styles.textColor2]}>{localizedUiText.m_69fdd3ca802e + " "}{resolution.votesAgainst} ({againstPercent}%)</Text>
            <Text style={[styles.voteText, styles.textColor3]}>{localizedUiText.m_122e473194f3 + " "}{resolution.votesAbstained} ({abstainPercent}%)</Text>
          </View>
          <Text style={styles.voteMeta}>{localizedUiText.m_42ad3fcfa090 + " "}{totalVotes}{" " + localizedUiText.m_28391d3bc64e + " "}{resolution.totalEligibleVoters}</Text>
        </DetailCard>)}

      <DetailCard title={localizedUiText.m_ff8059dc6752}>
        {resolution.status === 'OPEN_FOR_VOTING' && !resolution.myVote && (<ActionTile title={localizedUiText.m_b1da7269da05} iconName="checkmark-done-circle-outline" onPress={() => navigation.navigate('CastResolutionVote', { resolutionId })}/>)}
        <ActionTile title={localizedUiText.m_7179318f6eb3} iconName="stats-chart-outline" onPress={() => navigation.navigate('ResolutionResults', { resolutionId })}/>
      </DetailCard>
    </ParkingScreen>);
}

