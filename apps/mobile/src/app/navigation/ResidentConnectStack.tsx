import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ResidentConnectStackParamList } from './navigation.types';


import { ResidentConnectHomeScreen } from '../../modules/resident/residentConnect/screens/ResidentConnectHomeScreen';
import { ResidentDirectoryScreen } from '../../modules/resident/residentConnect/screens/ResidentDirectoryScreen';
import { ResidentSearchScreen } from '../../modules/resident/residentConnect/screens/ResidentSearchScreen';
import { ResidentPreviewScreen } from '../../modules/resident/residentConnect/screens/ResidentPreviewScreen';
import { CreateContactRequestScreen } from '../../modules/resident/residentConnect/screens/CreateContactRequestScreen';
import { IncomingContactRequestsScreen } from '../../modules/resident/residentConnect/screens/IncomingContactRequestsScreen';
import { OutgoingContactRequestsScreen } from '../../modules/resident/residentConnect/screens/OutgoingContactRequestsScreen';
import { ContactRequestDetailScreen } from '../../modules/resident/residentConnect/screens/ContactRequestDetailScreen';
import { AcceptedContactsScreen } from '../../modules/resident/residentConnect/screens/AcceptedContactsScreen';
import { ChatThreadListScreen } from '../../modules/resident/residentConnect/screens/ChatThreadListScreen';
import { ChatConversationScreen } from '../../modules/resident/residentConnect/screens/ChatConversationScreen';
import { BlockedResidentsScreen } from '../../modules/resident/residentConnect/screens/BlockedResidentsScreen';
import { ReportResidentConnectScreen } from '../../modules/resident/residentConnect/screens/ReportResidentConnectScreen';
import { ResidentPrivacySettingsScreen } from '../../modules/resident/residentConnect/screens/ResidentPrivacySettingsScreen';

const Stack = createNativeStackNavigator<ResidentConnectStackParamList>();

export function ResidentConnectStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResidentConnectHome" component={ResidentConnectHomeScreen} />
      <Stack.Screen name="ResidentDirectory" component={ResidentDirectoryScreen} />
      <Stack.Screen name="ResidentSearch" component={ResidentSearchScreen} />
      <Stack.Screen name="ResidentPreview" component={ResidentPreviewScreen} />
      <Stack.Screen name="CreateContactRequest" component={CreateContactRequestScreen} />
      <Stack.Screen name="IncomingContactRequests" component={IncomingContactRequestsScreen} />
      <Stack.Screen name="OutgoingContactRequests" component={OutgoingContactRequestsScreen} />
      <Stack.Screen name="ContactRequestDetail" component={ContactRequestDetailScreen} />
      <Stack.Screen name="AcceptedContacts" component={AcceptedContactsScreen} />
      <Stack.Screen name="ChatThreadList" component={ChatThreadListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="BlockedResidents" component={BlockedResidentsScreen} />
      <Stack.Screen name="ReportResidentConnect" component={ReportResidentConnectScreen} />
      <Stack.Screen name="ResidentPrivacySettings" component={ResidentPrivacySettingsScreen} />
    </Stack.Navigator>
  );
}
export default ResidentConnectStack;
