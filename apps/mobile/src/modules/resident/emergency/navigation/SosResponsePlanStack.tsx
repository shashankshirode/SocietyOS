import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SosResponsePlanStackParamList } from '../../../../app/navigation/navigation.types';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useMessages } from '../../../../shared/constants/useMessages';
import { EmergencyAndSosSettingsScreen } from '../screens/sos/EmergencyAndSosSettingsScreen';
import { SosResponsePlansScreen } from '../screens/sos/SosResponsePlansScreen';
import { SosResponsePlanDetailsScreen } from '../screens/sos/SosResponsePlanDetailsScreen';
import { EmergencyContactsScreen } from '../screens/sos/EmergencyContactsScreen';
import { AddEmergencyContactScreen } from '../screens/sos/AddEmergencyContactScreen';
import { EmergencyContactDetailsScreen } from '../screens/sos/EmergencyContactDetailsScreen';
import { TrustedResidentSearchScreen } from '../screens/sos/TrustedResidentSearchScreen';
import { EmergencyProfileScreen } from '../screens/sos/EmergencyProfileScreen';
import { SosTestModeScreen } from '../screens/sos/SosTestModeScreen';
import { SosConfigurationHistoryScreen } from '../screens/sos/SosConfigurationHistoryScreen';
const Stack = createNativeStackNavigator<SosResponsePlanStackParamList>();
export function SosResponsePlanStack() {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const sosMsg = messages.resident?.emergency?.sosSettings ?? {};
    const contactMsg = messages.resident?.emergency?.sosContacts ?? {};
    const planMsg = messages.resident?.emergency?.sosPlans ?? {};
    const profileMsg = messages.resident?.emergency?.sosProfile ?? {};
    const testMsg = messages.resident?.emergency?.sosTest ?? {};
    const trustedMsg = messages.resident?.emergency?.sosTrusted ?? {};
    return (<Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: { fontWeight: '700', fontSize: 16 },
            contentStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            animation: 'slide_from_right',
        }}>
      <Stack.Screen name="EmergencyAndSosSettings" component={EmergencyAndSosSettingsScreen} options={{ title: sosMsg?.title ?? String(localizedUiText.m_ab855c7044b0) }}/>
      <Stack.Screen name="SosResponsePlans" component={SosResponsePlansScreen} options={{ title: sosMsg?.responsePlans ?? String(localizedUiText.m_1a6187b1781d) }}/>
      <Stack.Screen name="SosResponsePlanDetails" component={SosResponsePlanDetailsScreen} options={{ title: planMsg?.title ?? String(localizedUiText.m_e302ebf11c66) }}/>
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} options={{ title: contactMsg?.title ?? String(localizedUiText.m_06eaf514bc71) }}/>
      <Stack.Screen name="AddEmergencyContact" component={AddEmergencyContactScreen} options={{ title: contactMsg?.add ?? String(localizedUiText.m_0fb321a01a06) }}/>
      <Stack.Screen name="EmergencyContactDetails" component={EmergencyContactDetailsScreen} options={{ title: contactMsg?.details ?? String(localizedUiText.m_3e84af613350) }}/>
      <Stack.Screen name="TrustedResidentSearch" component={TrustedResidentSearchScreen} options={{ title: trustedMsg?.searchTitle ?? String(localizedUiText.m_e5f762c16bb5) }}/>
      <Stack.Screen name="EmergencyProfile" component={EmergencyProfileScreen} options={{ title: profileMsg?.title ?? String(localizedUiText.m_5477716ccddb) }}/>
      <Stack.Screen name="SosTestMode" component={SosTestModeScreen} options={{ title: testMsg?.title ?? String(localizedUiText.m_ddbce89e941f) }}/>
      <Stack.Screen name="SosConfigurationHistory" component={SosConfigurationHistoryScreen} options={{ title: String(localizedUiText.m_1a2a1ca0d9f9) }}/>
    </Stack.Navigator>);
}

