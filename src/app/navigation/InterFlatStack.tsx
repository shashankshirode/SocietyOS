import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { InterFlatStackParamList } from './navigation.types';
import { InterFlatHomeScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/InterFlatHomeScreen';
import { MyInterFlatIssuesScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/MyInterFlatIssuesScreen';
import { CreateInterFlatIssueScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/CreateInterFlatIssueScreen';
import { IssueTypeSelectionScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/IssueTypeSelectionScreen';
import { WaterLeakageIssueScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/WaterLeakageIssueScreen';
import { NoiseComplaintScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/NoiseComplaintScreen';
import { RenovationDisturbanceScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RenovationDisturbanceScreen';
import { PetNuisanceIssueScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/PetNuisanceIssueScreen';
import { CommonAreaDamageClaimScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/CommonAreaDamageClaimScreen';
import { AffectedFlatSelectionScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/AffectedFlatSelectionScreen';
import { InterFlatIssueDetailScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/InterFlatIssueDetailScreen';
import { IssueTimelineScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/IssueTimelineScreen';
import { NeighbourNotificationPreviewScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/NeighbourNotificationPreviewScreen';
import { RespondToInterFlatIssueScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RespondToInterFlatIssueScreen';
import { FacilityInspectionRequestScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/FacilityInspectionRequestScreen';
import { FacilityInspectionDetailScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/FacilityInspectionDetailScreen';
import { MediationCaseDetailScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/MediationCaseDetailScreen';
import { ResolutionProposalScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/ResolutionProposalScreen';
import { ResolutionAcceptanceScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/ResolutionAcceptanceScreen';
import { ClosureProofScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/ClosureProofScreen';
import { EscalationToCommitteeScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/EscalationToCommitteeScreen';
import { DisputeHistoryScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/DisputeHistoryScreen';
import { RuleLibraryScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RuleLibraryScreen';
import { RuleCategoryListScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RuleCategoryListScreen';
import { RuleDetailScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RuleDetailScreen';
import { RuleAcknowledgementScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/RuleAcknowledgementScreen';
import { MyRuleAcknowledgementsScreen } from '../../modules/resident/interFlatIssues/screens/interFlat_screens/MyRuleAcknowledgementsScreen';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
const Stack = createNativeStackNavigator<InterFlatStackParamList>();
export function InterFlatStack() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Stack.Navigator screenOptions={{ headerShown: true, title: String(localizedUiText.m_30c45c44af47) }}>
      <Stack.Screen name="InterFlatHome" component={InterFlatHomeScreen} options={{ title: String(localizedUiText.m_990d9fc59579) }}/>
      <Stack.Screen name="MyInterFlatIssues" component={MyInterFlatIssuesScreen} options={{ title: String(localizedUiText.m_56e0b35d4300) }}/>
      <Stack.Screen name="CreateInterFlatIssue" component={CreateInterFlatIssueScreen} options={{ title: String(localizedUiText.m_a6227b02ea69) }}/>
      <Stack.Screen name="IssueTypeSelection" component={IssueTypeSelectionScreen} options={{ title: String(localizedUiText.m_1e24aeb39693) }}/>
      <Stack.Screen name="WaterLeakageIssue" component={WaterLeakageIssueScreen} options={{ title: String(localizedUiText.m_de3d8189c757) }}/>
      <Stack.Screen name="NoiseComplaint" component={NoiseComplaintScreen} options={{ title: String(localizedUiText.m_4226d72b7a31) }}/>
      <Stack.Screen name="RenovationDisturbance" component={RenovationDisturbanceScreen} options={{ title: String(localizedUiText.m_0645c002c235) }}/>
      <Stack.Screen name="PetNuisanceIssue" component={PetNuisanceIssueScreen} options={{ title: String(localizedUiText.m_11e4a28bc924) }}/>
      <Stack.Screen name="CommonAreaDamageClaim" component={CommonAreaDamageClaimScreen} options={{ title: String(localizedUiText.m_d08016d3f21c) }}/>
      <Stack.Screen name="AffectedFlatSelection" component={AffectedFlatSelectionScreen} options={{ title: String(localizedUiText.m_052dd02dc807) }}/>
      <Stack.Screen name="InterFlatIssueDetail" component={InterFlatIssueDetailScreen} options={{ title: String(localizedUiText.m_fb219a1774f4) }}/>
      <Stack.Screen name="IssueTimeline" component={IssueTimelineScreen} options={{ title: String(localizedUiText.m_6c7ac13e9f36) }}/>
      <Stack.Screen name="NeighbourNotificationPreview" component={NeighbourNotificationPreviewScreen} options={{ title: String(localizedUiText.m_c9d628855f8f) }}/>
      <Stack.Screen name="RespondToInterFlatIssue" component={RespondToInterFlatIssueScreen} options={{ title: String(localizedUiText.m_9870b898491c) }}/>
      <Stack.Screen name="FacilityInspectionRequest" component={FacilityInspectionRequestScreen} options={{ title: String(localizedUiText.m_7ad098f214d2) }}/>
      <Stack.Screen name="FacilityInspectionDetail" component={FacilityInspectionDetailScreen} options={{ title: String(localizedUiText.m_bfb44b8a1ef5) }}/>
      <Stack.Screen name="MediationCaseDetail" component={MediationCaseDetailScreen} options={{ title: String(localizedUiText.m_1f0c79c62629) }}/>
      <Stack.Screen name="ResolutionProposal" component={ResolutionProposalScreen} options={{ title: String(localizedUiText.m_986521ed3607) }}/>
      <Stack.Screen name="ResolutionAcceptance" component={ResolutionAcceptanceScreen} options={{ title: String(localizedUiText.m_487b9a8366b3) }}/>
      <Stack.Screen name="ClosureProof" component={ClosureProofScreen} options={{ title: String(localizedUiText.m_2a8c98831600) }}/>
      <Stack.Screen name="EscalationToCommittee" component={EscalationToCommitteeScreen} options={{ title: String(localizedUiText.m_2b8fe6959813) }}/>
      <Stack.Screen name="DisputeHistory" component={DisputeHistoryScreen} options={{ title: String(localizedUiText.m_c195aadd4d93) }}/>
      <Stack.Screen name="RuleLibrary" component={RuleLibraryScreen} options={{ title: String(localizedUiText.m_4ef3ec6f9367) }}/>
      <Stack.Screen name="RuleCategoryList" component={RuleCategoryListScreen} options={{ title: String(localizedUiText.m_39cde15bd3bd) }}/>
      <Stack.Screen name="RuleDetail" component={RuleDetailScreen} options={{ title: String(localizedUiText.m_529164b7cf43) }}/>
      <Stack.Screen name="RuleAcknowledgement" component={RuleAcknowledgementScreen} options={{ title: String(localizedUiText.m_4f48cb73bf4a) }}/>
      <Stack.Screen name="MyRuleAcknowledgements" component={MyRuleAcknowledgementsScreen} options={{ title: String(localizedUiText.m_c10067e7727c) }}/>
    </Stack.Navigator>);
}
export type { InterFlatStackParamList };

