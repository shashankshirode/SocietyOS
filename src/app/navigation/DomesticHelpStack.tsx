import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DomesticHelpStackParamList } from './navigation.types';
import { ResidentDomesticHelpAccessScreen } from '../../modules/resident/domesticHelp/screens/ResidentDomesticHelpAccessScreen';
import { ResidentDomesticHelpAttendanceScreen } from '../../modules/resident/domesticHelp/screens/ResidentDomesticHelpAttendanceScreen';
import { ResidentDomesticHelpDetailScreen } from '../../modules/resident/domesticHelp/screens/ResidentDomesticHelpDetailScreen';
import { ResidentDomesticHelpHomeScreen } from '../../modules/resident/domesticHelp/screens/ResidentDomesticHelpHomeScreen';
import { ResidentDomesticHelpServiceControlsScreen } from '../../modules/resident/domesticHelp/screens/ResidentDomesticHelpServiceControlsScreen';

const Stack = createNativeStackNavigator<DomesticHelpStackParamList>();

export function DomesticHelpStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DomesticHelpHome" component={ResidentDomesticHelpHomeScreen} />
      <Stack.Screen name="DomesticHelpDetail" component={ResidentDomesticHelpDetailScreen} />
      <Stack.Screen name="DomesticHelpAttendance" component={ResidentDomesticHelpAttendanceScreen} />
      <Stack.Screen name="DomesticHelpAccess" component={ResidentDomesticHelpAccessScreen} />
      <Stack.Screen name="DomesticHelpServiceControls" component={ResidentDomesticHelpServiceControlsScreen} />
    </Stack.Navigator>
  );
}
