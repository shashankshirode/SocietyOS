import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResidentProfileScreen } from '../../modules/resident/profile/screens/ResidentProfileScreen';
import { SettingsScreen } from '../../modules/profile/screens/SettingsScreen';
import { AppearanceSettingsScreen } from '../../modules/profile/screens/AppearanceSettingsScreen';
import { NotificationSettingsScreen } from '../../modules/resident/settings/screens/NotificationSettingsScreen';
import { LanguageSettingsScreen } from '../../modules/settings/screens/LanguageSettingsScreen';
import { AccessibilitySettingsScreen } from '../../modules/settings/screens/AccessibilitySettingsScreen';
import { PrivacySettingsScreen } from '../../modules/settings/screens/PrivacySettingsScreen';
import type { ProfileStackParamList } from './navigation.types';
const Stack = createNativeStackNavigator<ProfileStackParamList>();
function SettingsScreenAdapter(props: NativeStackScreenProps<ProfileStackParamList, 'Settings'>) {
    return <SettingsScreen navigation={props.navigation}/>;
}
function AppearanceScreenAdapter(props: NativeStackScreenProps<ProfileStackParamList, 'Appearance'>) {
    return <AppearanceSettingsScreen navigation={props.navigation}/>;
}
function NotificationsScreenAdapter(props: NativeStackScreenProps<ProfileStackParamList, 'Notifications'>) {
    return <NotificationSettingsScreen navigation={props.navigation}/>;
}
export function ProfileNavigator() {
    return (<Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ResidentProfileScreen}/>
      <Stack.Screen name="Settings" component={SettingsScreenAdapter}/>
      <Stack.Screen name="Appearance" component={AppearanceScreenAdapter}/>
      <Stack.Screen name="Notifications" component={NotificationsScreenAdapter}/>
      <Stack.Screen name="Language" component={LanguageSettingsScreen}/>
      <Stack.Screen name="Accessibility" component={AccessibilitySettingsScreen}/>
      <Stack.Screen name="Privacy" component={PrivacySettingsScreen}/>
    </Stack.Navigator>);
}
export default ProfileNavigator;
