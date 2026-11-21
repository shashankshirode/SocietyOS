import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareMetricCard } from "../components/HardwareMetricCard";
import { EvChargerCard } from "../components/EvChargerCard";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useEvChargingDashboard } from "../hooks/useEvChargingDashboard";
import { useHardwareDevices } from "../hooks/useHardwareDevices";
import { styles } from "../styles/screens/EvChargingDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function EvChargingDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: dashboard, isLoading: isDashboardLoading } = useEvChargingDashboard();
    const { data: devices, isLoading: isDevicesLoading } = useHardwareDevices();
    const chargers = (devices || []).filter(d => d.type === 'EV_CHARGER');
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_2a3762d5ae71}</Text>
          <Pressable onPress={() => navigation.navigate('EvChargingSessionPlaceholder', { sessionId: 'evs-001' })} style={styles.addButton}>
            <Ionicons name="flash-outline" size={24} color={Colors.primary}/>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          {isDashboardLoading ? (<Text style={styles.loading}>{localizedUiText.m_4ecefaae7ab1}</Text>) : (<View style={styles.metricsGrid}>
              <HardwareMetricCard label={localizedUiText.m_2922efb43e72} value={dashboard?.totalChargers || 0}/>
              <HardwareMetricCard label={localizedUiText.m_e674447337e8} value={dashboard?.availableChargersCount || 0} color={Colors.success}/>
              <HardwareMetricCard label={localizedUiText.m_c69334032dc1} value={dashboard?.occupiedChargersCount || 0} color={Colors.danger}/>
            </View>)}

          <Text style={styles.sectionTitle}>{localizedUiText.m_581ff2743881}</Text>
          {isDevicesLoading ? (<Text style={styles.loading}>{localizedUiText.m_2fdffaa8d66e}</Text>) : (chargers.map(item => (<EvChargerCard key={item.id} charger={{
                id: item.id,
                name: item.name,
                chargerCode: item.deviceCode,
                location: item.location,
                connectorType: 'CCS Type 2',
                status: item.status === 'ONLINE' ? 'AVAILABLE' : 'OFFLINE',
                totalEnergyDeliveredKwh: 450,
                billingReadiness: 'READY',
            }} onPress={() => navigation.navigate('EvChargerDetail', { chargerId: item.id })}/>)))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

