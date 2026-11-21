import { Text, View } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { StatusBadge, getPollStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { DetailCard, ParkingScreen } from "../../parking/components/ParkingUi";
import { useRepositoryResult } from "../../../../core/repositories/useRepositoryResult";
import { governanceRepository } from "../data/governance.repository";
import type { PollResultsScreenProps } from "../../../../app/navigation/navigation.types";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { styles, createViewWidthStyle, createTextColorStyle } from "../styles/screens/PollResultsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function PollResultsScreen({ navigation, route }: PollResultsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { pollId } = route.params;
    const { activeContext } = useActiveResidentHome();
    const { data: results, isLoading, error, refetch } = useRepositoryResult(() => governanceRepository.getPollResults(pollId, { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }), [pollId, activeContext.dataScopeKey]);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_b00da16333ce} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!results)
        return <ErrorState message={localizedUiText.m_2734e9271c2e} onRetry={refetch}/>;
    return (<ParkingScreen title={localizedUiText.m_fd6415fb3731} subtitle={results.title} onBack={navigation.goBack}>
      <View style={styles.statusRow}>
        <StatusBadge label={results.status.replace(/_/g, ' ')} type={getPollStatusBadgeType(results.status)}/>
        <Text style={styles.typeText}>{results.pollType.replace(/_/g, ' ')}</Text>
      </View>

      <Text style={styles.title}>{results.title}</Text>

      <DetailCard title={localizedUiText.m_219c4a6c86a7}>
        {results.options.map((opt) => (<View key={opt.id} style={styles.optionRow}>
            <View style={styles.optionHeader}>
              <View style={styles.optionLabelRow}>
                {opt.isWinner && <Text style={styles.winnerIcon}>🏆</Text>}
                <Text style={[styles.optionLabel, opt.isWinner && styles.winnerLabel]}>{opt.label}</Text>
              </View>
              <Text style={styles.optionValue}>{opt.voteCount} ({opt.percentage}%)</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, createViewWidthStyle(`${opt.percentage}%`), opt.isWinner && styles.winnerBar]}/>
            </View>
          </View>))}
      </DetailCard>

      <DetailCard title={localizedUiText.m_a656107e99c7}>
        <View style={styles.statRow}><Text style={styles.statLabel}>{localizedUiText.m_e1056b0bb68b}</Text><Text style={styles.statValue}>{results.totalVotes}</Text></View>
        <View style={styles.statRow}><Text style={styles.statLabel}>{localizedUiText.m_4f85799f122a}</Text><Text style={styles.statValue}>{results.totalEligibleVoters}</Text></View>
        <View style={styles.statRow}><Text style={styles.statLabel}>{localizedUiText.m_187cfa68cb0d}</Text><Text style={[styles.statValue, createTextColorStyle(results.participationRate >= 50 ? Colors.success : Colors.warning)]}>{results.participationRate}%</Text></View>
        {results.closedAt && <View style={styles.statRow}><Text style={styles.statLabel}>{localizedUiText.m_c21ead0614e7}</Text><Text style={styles.statValue}>{formatResidentDate(results.closedAt)}</Text></View>}
      </DetailCard>
    </ParkingScreen>);
}

