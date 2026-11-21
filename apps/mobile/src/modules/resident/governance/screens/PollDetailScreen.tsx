import { ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge, getPollStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { usePollDetail } from "../data/usePollDetail";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3 } from "../styles/screens/PollDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type PollDetailProps = {
    navigation?: {
        dispatch: (action: ReturnType<typeof CommonActions.navigate>) => void;
    };
    route?: {
        params?: {
            pollId?: string;
        };
    };
};
export function PollDetailScreen({ navigation, route }: PollDetailProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { activeContext } = useActiveResidentHome();
    const pollId = route?.params?.pollId ?? '';
    const { data: poll, isLoading, error, refetch } = usePollDetail(pollId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_ad50eb950d3f} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!poll)
        return <ErrorState message={localizedUiText.m_2bcc07bf9752} onRetry={refetch}/>;
    const ownerEligible = activeContext.residentRole === 'owner' || activeContext.residentRole === 'coOwner';
    const eligible = poll.eligibility !== 'OWNERS_ONLY' || ownerEligible;
    const isOpen = poll.status === 'OPEN' || poll.status === 'ACTIVE';
    const hasVoted = poll.myVoteStatus === 'VOTED';
    const mayViewResults = !isOpen || poll.showResultsBeforeClose || hasVoted;
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_e131f4fb32ea} showBackButton/>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
          <View style={styles.statusRow}>
            <StatusBadge label={poll.status.replaceAll('_', ' ')} type={getPollStatusBadgeType(poll.status)}/>
            <SafeText variant="tiny" color="secondary">{poll.pollType.replaceAll('_', ' ')}</SafeText>
          </View>
          <SafeText variant="title" style={createSafeTextColorStyle(theme.textPrimary)}>{poll.title}</SafeText>
          <SafeText variant="body" color="secondary">{poll.description}</SafeText>
          <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>
          <SafeText variant="tiny" color="secondary">{localizedUiText.m_74c21a6312ed}{formatResidentDate(poll.expiresAt)} · {poll.totalVotes}{" " + localizedUiText.m_2ab4266d938f + " "}{poll.participationRate}{localizedUiText.m_ee13c1acf460}</SafeText>
        </View>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>{localizedUiText.m_d0db8b5e364b}</SafeText>
          {poll.options.map((option) => {
            const selected = poll.myVotedOptionIds?.includes(option.id) ?? false;
            return (<View key={option.id} style={[styles.option, createViewBackgroundColorBorderColorStyle2(theme.surface, selected ? theme.accent : theme.border)]}>
                <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={selected ? theme.accent : theme.textSecondary}/>
                <View style={styles.optionText}>
                  <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>{option.label}</SafeText>
                  {mayViewResults ? (<SafeText variant="tiny" color="secondary">{option.voteCount}{" " + localizedUiText.m_2ab4266d938f + " "}{option.percentage}%</SafeText>) : null}
                </View>
              </View>);
        })}
        </View>

        {!eligible ? (<View style={[styles.notice, createViewBackgroundColorBorderColorStyle3(theme.surfaceRaised, theme.border)]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.warning}/>
            <SafeText variant="caption" color="secondary" style={styles.optionText}>{localizedUiText.m_eac7aa27037c}</SafeText>
          </View>) : isOpen && !hasVoted && navigation ? (<AppButton title={localizedUiText.m_77a8902b15b8} onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'SubmitPollVote', params: { pollId } }))}/>) : (<SafeText variant="caption" style={createSafeTextColorStyle4(theme.success)}>
            {hasVoted ? localizedUiText.m_30369cb2b490 : localizedUiText.m_4cb282bb5012}
          </SafeText>)}

        {mayViewResults && navigation ? (<AppButton title={localizedUiText.m_f26efd357499} variant="outline" onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'PollResults', params: { pollId } }))}/>) : null}
      </ScrollView>
    </View>);
}

