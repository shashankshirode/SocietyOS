import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '../../shared/theme';
import { AppModeNavigator } from './AppModeNavigator';
import { ResidentEntryNavigator } from '../../modules/resident/auth/ResidentEntryNavigator';
import { GuardNavigator } from './GuardNavigator';
import { FacilityNavigator } from './FacilityNavigator';
import { SuperAdminStack } from './SuperAdminStack';
import { HardwareIntegrationStack } from './HardwareIntegrationStack';
import { AdminNavigator } from './AdminNavigator';
import { TreasurerNavigator } from './TreasurerNavigator';
import type { RootStackParamList } from './navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();


export function RootNavigator() {
  const { colors, dark } = useAppTheme();

  const navTheme = {
    ...DefaultTheme,
    dark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={colors.statusBarStyle === 'light-content' ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppModeSelector" component={AppModeNavigator} />
        <Stack.Screen name="ResidentApp" component={ResidentEntryNavigator} />
        <Stack.Screen name="GuardApp" component={GuardNavigator} />
        <Stack.Screen name="FacilityManagerApp" component={FacilityNavigator} />
        <Stack.Screen name="SuperAdminApp" component={SuperAdminStack} />
        <Stack.Screen name="HardwareApp" component={HardwareIntegrationStack} />
        <Stack.Screen name="SocietyAdminApp" component={AdminNavigator} />
        <Stack.Screen name="TreasurerApp" component={TreasurerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
