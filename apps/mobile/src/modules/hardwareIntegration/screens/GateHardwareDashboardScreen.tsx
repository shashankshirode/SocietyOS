import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareMetricCard } from "../components/HardwareMetricCard";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useGateHardwareDashboard } from "../hooks/useGateHardwareDashboard";
import { styles } from "../styles/screens/GateHardwareDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function GateHardwareDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: dashboard, isLoading } = useGateHardwareDashboard();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_c16d80150104}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_4ecefaae7ab1}</Text>) : (<View style={styles.metricsGrid}>
              <HardwareMetricCard label={localizedUiText.m_15a3c2edc83a} value={dashboard?.rfidReadersCount || 0}/>
              <HardwareMetricCard label={localizedUiText.m_9b2c3dd9d519} value={dashboard?.anprCamerasCount || 0}/>
              <HardwareMetricCard label={localizedUiText.m_c1f6dc886c8c} value={dashboard?.boomBarriersCount || 0}/>
              <HardwareMetricCard label={localizedUiText.m_160a7230bcd2} value={dashboard?.totalGateEventsToday || 0} color={Colors.primary}/>
            </View>)}

          <View style={styles.menu}>
            <Pressable style={styles.menuItem} onPress={() => navigation.navigate('RfidReadiness')}>
              <Ionicons name="card-outline" size={24} color={Colors.primary}/>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{localizedUiText.m_6543d0520c21}</Text>
                <Text style={styles.menuDesc}>{localizedUiText.m_389721368f4a}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigation.navigate('AnprReadiness')}>
              <Ionicons name="scan-outline" size={24} color={Colors.primary}/>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{localizedUiText.m_da17f09dc08d}</Text>
                <Text style={styles.menuDesc}>{localizedUiText.m_e6316175aab2}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigation.navigate('BoomBarrierPlaceholder')}>
              <Ionicons name="git-commit-outline" size={24} color={Colors.primary}/>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{localizedUiText.m_78dd6d795f87}</Text>
                <Text style={styles.menuDesc}>{localizedUiText.m_e0f18d3d53c4}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

