import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { RouteGuard } from "../../core/permissions/RouteGuard";
import { GuardHomeScreen } from "../../modules/guard/screens/GuardHomeScreen";
import { ExpectedVisitorsScreen } from "../../modules/guard/screens/ExpectedVisitorsScreen";
import { PassSearchScreen } from "../../modules/guard/screens/PassSearchScreen";
import { VisitorVerificationScreen } from "../../modules/guard/screens/VisitorVerificationScreen";
import { RecordEntryScreen } from "../../modules/guard/screens/RecordEntryScreen";
import { ManualEntryScreen } from "../../modules/guard/screens/ManualEntryScreen";
import { QuickEntryScreen } from "../../modules/guard/screens/QuickEntryScreen";
import { StaffCheckInScreen } from "../../modules/guard/screens/StaffCheckInScreen";
import { GateActivityLogScreen } from "../../modules/guard/screens/GateActivityLogScreen";
import { OfflineQueueScreen } from "../../modules/guard/screens/OfflineQueueScreen";
import { EmergencyAlertScreen } from "../../modules/guard/screens/EmergencyAlertScreen";
import { ShiftHandoverScreen } from "../../modules/guard/screens/ShiftHandoverScreen";
import { GuardMoreScreen } from "../../modules/guard/screens/GuardMoreScreen";
import { GuardVehicleLookupScreen } from "../../modules/resident/parking/screens/GuardVehicleLookupScreen";
import { GuardResidentInboxScreen } from "../../modules/guard/chat/screens/GuardResidentInboxScreen";
import { GuardResidentConversationScreen } from "../../modules/guard/chat/screens/GuardResidentConversationScreen";
import type { GuardTabParamList, GuardStackParamList } from "./navigation.types";
import { styles } from "./styles/GuardNavigator.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
const Tab = createBottomTabNavigator<GuardTabParamList>();
const Stack = createNativeStackNavigator<GuardStackParamList>();
const tabIconNames: Record<keyof GuardTabParamList, {
    filled: keyof typeof Ionicons.glyphMap;
    outline: keyof typeof Ionicons.glyphMap;
}> = {
    GuardHomeTab: { filled: 'shield', outline: 'shield-outline' },
    GuardExpectedTab: { filled: 'people', outline: 'people-outline' },
    GuardSearchTab: { filled: 'qr-code', outline: 'qr-code-outline' },
    GuardLogsTab: { filled: 'list-circle', outline: 'list-circle-outline' },
    GuardMoreTab: { filled: 'ellipsis-horizontal-circle', outline: 'ellipsis-horizontal-circle-outline' },
};
function GuardTabNavigator() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabBarBottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;
    const tabBarHeight = 56 + tabBarBottomPadding;
    const isTablet = width > 600;
    return (<Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                ...styles.tabBar,
                backgroundColor: colors.tabBarBackground,
                borderTopColor: colors.border,
                height: isTablet ? 64 : tabBarHeight,
                paddingBottom: isTablet ? 8 : tabBarBottomPadding,
                ...(isTablet ? {
                    position: 'absolute',
                    bottom: 16,
                    left: (width - 600) / 2,
                    right: (width - 600) / 2,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                } : {})
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.tabBarInactive,
            tabBarLabelStyle: styles.tabLabel,
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ focused, color, size }) => {
                const icons = tabIconNames[route.name];
                const iconName = focused ? icons.filled : icons.outline;
                return <Ionicons name={iconName} size={size ?? 22} color={color}/>;
            },
        })}>
      <Tab.Screen name="GuardHomeTab" component={GuardHomeScreen} options={{ tabBarLabel: String(localizedUiText.m_3a78695388b3) }}/>
      <Tab.Screen name="GuardExpectedTab" component={ExpectedVisitorsScreen} options={{ tabBarLabel: String(localizedUiText.m_ca99b7f1b14e) }}/>
      <Tab.Screen name="GuardSearchTab" component={PassSearchScreen} options={{ tabBarLabel: String(localizedUiText.m_eea2745e2867) }}/>
      <Tab.Screen name="GuardLogsTab" component={GateActivityLogScreen} options={{ tabBarLabel: String(localizedUiText.m_ea2100dc89ae) }}/>
      <Tab.Screen name="GuardMoreTab" component={GuardMoreScreen} options={{ tabBarLabel: String(localizedUiText.m_d696a35bdd18) }}/>
    </Tab.Navigator>);
}
const stackScreenOptions = {
    headerShown: false,
    animation: 'slide_from_right' as const,
    animationDuration: 220,
};
export function GuardNavigator() {
    return (<RouteGuard permission="GATE_ENTRY_RECORD">
      <Stack.Navigator screenOptions={stackScreenOptions}>
        <Stack.Screen name="GuardHome" component={GuardTabNavigator}/>
        <Stack.Screen name="VisitorVerification" component={VisitorVerificationScreen}/>
        <Stack.Screen name="RecordEntry" component={RecordEntryScreen}/>
        <Stack.Screen name="ManualEntry" component={ManualEntryScreen}/>
        <Stack.Screen name="QuickEntry" component={QuickEntryScreen}/>
        <Stack.Screen name="StaffCheckIn" component={StaffCheckInScreen}/>
        <Stack.Screen name="OfflineQueue" component={OfflineQueueScreen}/>
        <Stack.Screen name="EmergencyAlert" component={EmergencyAlertScreen}/>
        <Stack.Screen name="ShiftHandover" component={ShiftHandoverScreen}/>
        <Stack.Screen name="GuardVehicleLookup" component={GuardVehicleLookupScreen}/>
        <Stack.Screen name="GuardChatInbox" component={GuardResidentInboxScreen}/>
        <Stack.Screen name="GuardChatConversation" component={GuardResidentConversationScreen}/>
      </Stack.Navigator>
    </RouteGuard>);
}
export default GuardNavigator;

