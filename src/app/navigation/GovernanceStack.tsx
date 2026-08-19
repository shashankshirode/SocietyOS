import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GovernanceStackParamList } from './navigation.types';
import { GovernanceHomeScreen } from '../../modules/resident/governance/screens/GovernanceHomeScreen';
import { MeetingListScreen } from '../../modules/resident/governance/screens/MeetingListScreen';
import { MeetingDetailScreen } from '../../modules/resident/governance/screens/MeetingDetailScreen';
import { MeetingAgendaScreen } from '../../modules/resident/governance/screens/MeetingAgendaScreen';
import { MeetingRsvpScreen } from '../../modules/resident/governance/screens/MeetingRsvpScreen';
import { ResolutionListScreen } from '../../modules/resident/governance/screens/ResolutionListScreen';
import { ResolutionDetailScreen } from '../../modules/resident/governance/screens/ResolutionDetailScreen';
import { CastResolutionVoteScreen } from '../../modules/resident/governance/screens/CastResolutionVoteScreen';
import { ResolutionResultsScreen } from '../../modules/resident/governance/screens/ResolutionResultsScreen';
import { MeetingMinutesDetailScreen } from '../../modules/resident/governance/screens/MeetingMinutesDetailScreen';
import { PollListScreen } from '../../modules/resident/governance/screens/PollListScreen';
import { PollDetailScreen } from '../../modules/resident/governance/screens/PollDetailScreen';
import { SubmitPollVoteScreen } from '../../modules/resident/governance/screens/SubmitPollVoteScreen';
import { PollResultsScreen } from '../../modules/resident/governance/screens/PollResultsScreen';
import { ElectionDashboardScreen } from '../../modules/resident/governance/screens/ElectionDashboardScreen';
import { QuestionSubmissionScreen } from '../../modules/resident/governance/screens/QuestionSubmissionScreen';
import { ProxyAuthorizationScreen } from '../../modules/resident/governance/screens/ProxyAuthorizationScreen';

const Stack = createNativeStackNavigator<GovernanceStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function GovernanceStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="GovernanceHome" component={GovernanceHomeScreen} />
      <Stack.Screen name="MeetingList" component={MeetingListScreen} />
      <Stack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
      <Stack.Screen name="MeetingAgenda" component={MeetingAgendaScreen} />
      <Stack.Screen name="MeetingRsvp" component={MeetingRsvpScreen} />
      <Stack.Screen name="QuestionSubmission" component={QuestionSubmissionScreen} />
      <Stack.Screen name="ProxyAuthorization" component={ProxyAuthorizationScreen} />
      <Stack.Screen name="ResolutionList" component={ResolutionListScreen} />
      <Stack.Screen name="ResolutionDetail" component={ResolutionDetailScreen} />
      <Stack.Screen name="CastResolutionVote" component={CastResolutionVoteScreen} />
      <Stack.Screen name="ResolutionResults" component={ResolutionResultsScreen} />
      <Stack.Screen name="MeetingMinutesDetail" component={MeetingMinutesDetailScreen} />
      <Stack.Screen name="PollList" component={PollListScreen} />
      <Stack.Screen name="PollDetail" component={PollDetailScreen} />
      <Stack.Screen name="SubmitPollVote" component={SubmitPollVoteScreen} />
      <Stack.Screen name="PollResults" component={PollResultsScreen} />
      <Stack.Screen name="ElectionDashboard" component={ElectionDashboardScreen} />
    </Stack.Navigator>
  );
}
