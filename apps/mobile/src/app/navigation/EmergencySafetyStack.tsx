import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { EmergencySafetyStackParamList } from './navigation.types';
import { EmergencySafetyHomeScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencySafetyHomeScreen';
import { SosQuickActionScreen } from '../../modules/resident/emergency/screens/safety_screens/SosQuickActionScreen';
import { EmergencyTypeSelectionScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyTypeSelectionScreen';
import { MedicalEmergencyScreen } from '../../modules/resident/emergency/screens/safety_screens/MedicalEmergencyScreen';
import { FireAlertScreen } from '../../modules/resident/emergency/screens/safety_screens/FireAlertScreen';
import { LiftStuckAlertScreen } from '../../modules/resident/emergency/screens/safety_screens/LiftStuckAlertScreen';
import { SecurityThreatAlertScreen } from '../../modules/resident/emergency/screens/safety_screens/SecurityThreatAlertScreen';
import { EmergencyConfirmationScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyConfirmationScreen';
import { ActiveEmergencyDetailScreen } from '../../modules/resident/emergency/screens/safety_screens/ActiveEmergencyDetailScreen';
import { EmergencyIncidentTimelineScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyIncidentTimelineScreen';
import { MyEmergencyHistoryScreen } from '../../modules/resident/emergency/screens/safety_screens/MyEmergencyHistoryScreen';
import { EmergencyContactManagementScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyContactManagementScreen';
import { FamilyConnectScreen } from '../../modules/resident/emergency/screens/safety_screens/FamilyConnectScreen';
import { SeniorCitizenProfileScreen } from '../../modules/resident/seniorCare/screens/SeniorCitizenProfileScreen';
import { SeniorSimpleModeScreen } from '../../modules/resident/seniorCare/screens/SeniorSimpleModeScreen';
import { SeniorDailyCheckInScreen } from '../../modules/resident/emergency/screens/safety_screens/SeniorDailyCheckInScreen';
import { SeniorInactivityAlertsScreen } from '../../modules/resident/seniorCare/screens/SeniorInactivityAlertsScreen';
import { EmergencyVolunteerDirectoryScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyVolunteerDirectoryScreen';
import { EmergencyVolunteerRegistrationScreen } from '../../modules/resident/emergency/screens/safety_screens/EmergencyVolunteerRegistrationScreen';
import { VolunteerAlertDetailScreen } from '../../modules/resident/emergency/screens/safety_screens/VolunteerAlertDetailScreen';
import { SafetyInstructionsScreen } from '../../modules/resident/emergency/screens/safety_screens/SafetyInstructionsScreen';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
const Stack = createNativeStackNavigator<EmergencySafetyStackParamList>();
export function EmergencySafetyStack() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Stack.Navigator screenOptions={{ headerShown: true, title: String(localizedUiText.m_a53398a3ea45) }}>
      <Stack.Screen name="EmergencySafetyHome" component={EmergencySafetyHomeScreen} options={{ title: String(localizedUiText.m_99a84a8c1c8e) }}/>
      <Stack.Screen name="SosQuickAction" component={SosQuickActionScreen} options={{ title: String(localizedUiText.m_f7d20de02982) }}/>
      <Stack.Screen name="EmergencyTypeSelection" component={EmergencyTypeSelectionScreen} options={{ title: String(localizedUiText.m_c5758251c075) }}/>
      <Stack.Screen name="MedicalEmergency" component={MedicalEmergencyScreen} options={{ title: String(localizedUiText.m_fb6e65bf4bea) }}/>
      <Stack.Screen name="FireAlert" component={FireAlertScreen} options={{ title: String(localizedUiText.m_db70deae6481) }}/>
      <Stack.Screen name="LiftStuckAlert" component={LiftStuckAlertScreen} options={{ title: String(localizedUiText.m_5c21f060b33b) }}/>
      <Stack.Screen name="SecurityThreatAlert" component={SecurityThreatAlertScreen} options={{ title: String(localizedUiText.m_c422428f906e) }}/>
      <Stack.Screen name="EmergencyConfirmation" component={EmergencyConfirmationScreen} options={{ title: String(localizedUiText.m_24292e1a9625) }}/>
      <Stack.Screen name="ActiveEmergencyDetail" component={ActiveEmergencyDetailScreen} options={{ title: String(localizedUiText.m_0c201c8b9e73) }}/>
      <Stack.Screen name="EmergencyIncidentTimeline" component={EmergencyIncidentTimelineScreen} options={{ title: String(localizedUiText.m_9dcff98e275f) }}/>
      <Stack.Screen name="MyEmergencyHistory" component={MyEmergencyHistoryScreen} options={{ title: String(localizedUiText.m_bd230e11acf2) }}/>
      <Stack.Screen name="EmergencyContactManagement" component={EmergencyContactManagementScreen} options={{ title: String(localizedUiText.m_b450645debe2) }}/>
      <Stack.Screen name="FamilyConnect" component={FamilyConnectScreen} options={{ title: String(localizedUiText.m_c19e21903a9a) }}/>
      <Stack.Screen name="SeniorCitizenProfile" component={SeniorCitizenProfileScreen} options={{ title: String(localizedUiText.m_2db0d128ffc4) }}/>
      <Stack.Screen name="SeniorSimpleMode" component={SeniorSimpleModeScreen} options={{ title: String(localizedUiText.m_9d988fd81c28) }}/>
      <Stack.Screen name="SeniorDailyCheckIn" component={SeniorDailyCheckInScreen} options={{ title: String(localizedUiText.m_53f2fc9f8687) }}/>
      <Stack.Screen name="SeniorInactivityAlerts" component={SeniorInactivityAlertsScreen} options={{ title: String(localizedUiText.m_3ae46953c95e) }}/>
      <Stack.Screen name="EmergencyVolunteerDirectory" component={EmergencyVolunteerDirectoryScreen} options={{ title: String(localizedUiText.m_6ec733ad333c) }}/>
      <Stack.Screen name="EmergencyVolunteerRegistration" component={EmergencyVolunteerRegistrationScreen} options={{ title: String(localizedUiText.m_bb7234ec1245) }}/>
      <Stack.Screen name="VolunteerAlertDetail" component={VolunteerAlertDetailScreen} options={{ title: String(localizedUiText.m_ee726e720b86) }}/>
      <Stack.Screen name="SafetyInstructions" component={SafetyInstructionsScreen} options={{ title: String(localizedUiText.m_934652dce41d) }}/>
    </Stack.Navigator>);
}
export default EmergencySafetyStack;

