import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AutomationStackParamList } from './navigation.types';
import { AutomationDashboardScreen } from '../../modules/automation/screens/AutomationDashboardScreen';

const Stack = createNativeStackNavigator<AutomationStackParamList>();
const options = { headerShown: false, animation: 'slide_from_right' as const, animationDuration: 220 };

export function AutomationStack() {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="AutomationDashboard" component={AutomationDashboardScreen} />
      <Stack.Screen name="RuleBuilder" component={() => null} />
      <Stack.Screen name="RuleDetail" component={() => null} />
      <Stack.Screen name="ExecutionHistory" component={() => null} />
      <Stack.Screen name="ExecutionDetail" component={() => null} />
      <Stack.Screen name="ApprovalQueue" component={() => null} />
      <Stack.Screen name="DeadLetter" component={() => null} />
      <Stack.Screen name="DryRun" component={() => null} />
      <Stack.Screen name="ComplaintRouting" component={() => null} />
      <Stack.Screen name="NoticeDrafting" component={() => null} />
      <Stack.Screen name="DocumentSearch" component={() => null} />
      <Stack.Screen name="BillExplanation" component={() => null} />
      <Stack.Screen name="MeetingSummary" component={() => null} />
      <Stack.Screen name="MaintenanceRisk" component={() => null} />
    </Stack.Navigator>
  );
}