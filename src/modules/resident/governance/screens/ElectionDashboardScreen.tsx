import { FlatList, Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { AccessRestrictedState } from "../../../../shared/feedback/AccessRestrictedState";
import { StatusBadge, getElectionStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { DetailCard, ParkingScreen, WarningText } from "../../parking/components/ParkingUi";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { useElections } from "../data/useElections";
import type { ElectionDashboardScreenProps } from "../../../../app/navigation/navigation.types";
import type { Election, ElectionPosition } from "../../../../shared/types/election.types";
import { styles } from "../styles/screens/ElectionDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ElectionDashboardScreen({ navigation }: ElectionDashboardScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: elections, isLoading, error, refetch } = useElections();
    const { flags } = useFeatureFlags();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_ab850323ef62} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!flags.committeeElection || !flags.eVoting) {
        return (<AccessRestrictedState title={localizedUiText.m_1f076d1522af} description={localizedUiText.m_f3cfdcb73299} requiredPermission="ELECTION_MANAGE" onBack={navigation.goBack}/>);
    }
    const renderPosition = (position: ElectionPosition, election: Election) => (<View key={position.id} style={styles.positionCard}>
      <View style={styles.positionHeader}>
        <Text style={styles.positionTitle}>{position.title}</Text>
        <Text style={styles.vacancies}>{position.vacancies}{" " + localizedUiText.m_5d2c13d6f9fa}{position.vacancies > 1 ? localizedUiText.m_043a718774c5 : ''}</Text>
      </View>
      {position.candidates.length === 0 ? (<Text style={styles.noCandidates}>{localizedUiText.m_6b351e0d5cdb}</Text>) : (position.candidates.map((candidate) => (<View key={candidate.id} style={styles.candidateRow}>
            <View style={styles.candidateAvatar}>
              <Text style={styles.candidateAvatarText}>{candidate.name.charAt(0)}</Text>
            </View>
            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{candidate.name}{candidate.isElected ? ' 🏆' : ''}</Text>
              <Text style={styles.candidateUnit}>{candidate.unit}{" " + localizedUiText.m_f472f5907948 + " "}{candidate.proposedBy}</Text>
              {candidate.manifesto && <Text style={styles.manifesto} numberOfLines={2}>{candidate.manifesto}</Text>}
            </View>
            <View style={styles.candidateRight}>
              <StatusBadge label={candidate.nominationStatus} type={candidate.nominationStatus === 'ACCEPTED' ? 'success' : candidate.nominationStatus === 'REJECTED' ? 'danger' : 'warning'}/>
              {election.status === 'COMPLETED' && <Text style={styles.voteCount}>{candidate.voteCount}{" " + localizedUiText.m_9df609548dde}</Text>}
            </View>
          </View>)))}
    </View>);
    const renderElection = ({ item }: {
        item: Election;
    }) => (<DetailCard title={item.title}>
      <View style={styles.electionHeader}>
        <StatusBadge label={item.status.replace(/_/g, ' ')} type={getElectionStatusBadgeType(item.status)}/>
        <Text style={styles.electionMeta}>{item.totalEligibleVoters}{" " + localizedUiText.m_bd67fb751331}</Text>
      </View>
      <Text style={styles.electionDesc}>{item.description}</Text>
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{localizedUiText.m_c585ae3817fc + " "}{item.nominationStartDate} – {item.nominationEndDate}</Text>
        {item.votingStartDate && <Text style={styles.dateText}>{localizedUiText.m_8ef5b81ca2ff + " "}{item.votingStartDate} – {item.votingEndDate}</Text>}
      </View>
      <Text style={styles.conductor}>{localizedUiText.m_aeda409fafbf + " "}{item.conductedBy}</Text>

      {item.positions.map((pos) => renderPosition(pos, item))}

      {item.status === 'COMPLETED' && (<View style={styles.resultSummary}>
          <Text style={styles.resultText}>{localizedUiText.m_a4b514c64356 + " "}{item.totalVotes}{" " + localizedUiText.m_e43d3cd29d8d}{Math.round((item.totalVotes / item.totalEligibleVoters) * 100)}{localizedUiText.m_109a5ee56d0b}</Text>
        </View>)}
    </DetailCard>);
    return (<ParkingScreen title={localizedUiText.m_56ac9256e35a} subtitle={localizedUiText.m_5f4d809cd936} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_e0b40b87de43}</WarningText>

      <FlatList data={elections ?? []} keyExtractor={(item) => item.id} renderItem={renderElection} scrollEnabled={false} ListEmptyComponent={<Text style={styles.emptyText}>{localizedUiText.m_aeb9d1559f8b}</Text>}/>
    </ParkingScreen>);
}

