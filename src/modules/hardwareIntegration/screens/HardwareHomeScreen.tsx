import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { QuickActionCard } from "../../../shared/cards/QuickActionCard";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { HardwareMetricCard } from "../components/HardwareMetricCard";
import { useHardwareHome } from "../hooks/useHardwareHome";
import { styles } from "../styles/screens/HardwareHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareHomeScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: homeData, isLoading } = useHardwareHome();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>{localizedUiText.m_edde8ac83581}</Text>
            <Text style={styles.subtitle}>{localizedUiText.m_7b3e21d95c5f}</Text>
          </View>

          <HardwareWarningBanner />

          {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_d22a3ee95ae0}</Text>) : (<View style={styles.metricsRow}>
              <HardwareMetricCard label={localizedUiText.m_989e0ccb87ae} value={`${homeData?.readinessScore || 0}%`} color={Colors.primary}/>
              <HardwareMetricCard label={localizedUiText.m_341c74bdc81f} value={homeData?.onlineDevices || 0} color={Colors.success}/>
              <HardwareMetricCard label={localizedUiText.m_0d8d93590802} value={(homeData?.offlineDevices || 0) + (homeData?.errorDevices || 0)} color={Colors.danger}/>
            </View>)}

          <Text style={styles.sectionTitle}>{localizedUiText.m_5e89c5a48b01}</Text>
          <ResponsiveGrid columnsPhone={2} columnsTablet={3}>
            <QuickActionCard iconName="list-outline" title={localizedUiText.m_0aad4f473504} onPress={() => navigation.navigate('DeviceRegistry')}/>
            <QuickActionCard iconName="git-network-outline" title={localizedUiText.m_c16d80150104} onPress={() => navigation.navigate('GateHardwareDashboard')}/>
            <QuickActionCard iconName="card-outline" title={localizedUiText.m_debed07668e0} onPress={() => navigation.navigate('RfidReadiness')}/>
            <QuickActionCard iconName="scan-outline" title={localizedUiText.m_9b2c3dd9d519} onPress={() => navigation.navigate('AnprReadiness')}/>
            <QuickActionCard iconName="videocam-outline" title={localizedUiText.m_f55c458dfe2b} onPress={() => navigation.navigate('CctvAccessPlaceholder')}/>
            <QuickActionCard iconName="speedometer-outline" title={localizedUiText.m_2d0eb50445dd} onPress={() => navigation.navigate('SmartMeterDashboard')}/>
            <QuickActionCard iconName="battery-charging-outline" title={localizedUiText.m_2a3762d5ae71} onPress={() => navigation.navigate('EvChargingDashboard')}/>
            <QuickActionCard iconName="finger-print-outline" title={localizedUiText.m_0c75794563aa} onPress={() => navigation.navigate('BiometricConnectorAlignment')}/>
            <QuickActionCard iconName="refresh-circle-outline" title={localizedUiText.m_ecb87d29537c} onPress={() => navigation.navigate('HardwareSyncJobLogs')}/>
            <QuickActionCard iconName="warning-outline" title={localizedUiText.m_95d25e67ea8c} onPress={() => navigation.navigate('HardwareErrorReview')}/>
            <QuickActionCard iconName="shield-checkmark-outline" title={localizedUiText.m_5428d7fe5929} onPress={() => navigation.navigate('HardwareAuditLog')}/>
            <QuickActionCard iconName="settings-outline" title={localizedUiText.m_74a883a037bc} onPress={() => navigation.navigate('HardwareSettings')}/>
          </ResponsiveGrid>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

