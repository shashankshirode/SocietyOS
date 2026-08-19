import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DepartmentChatStackParamList } from './navigation.types';
import { DepartmentInboxScreen } from '../../modules/staffChat/screens/DepartmentInboxScreen';
import { DepartmentResidentConversationScreen } from '../../modules/staffChat/screens/DepartmentResidentConversationScreen';

const Stack = createNativeStackNavigator<DepartmentChatStackParamList>();
export function DepartmentChatStack() {
  return <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="DepartmentInbox" component={DepartmentInboxScreen} /><Stack.Screen name="DepartmentConversation" component={DepartmentResidentConversationScreen} /></Stack.Navigator>;
}
