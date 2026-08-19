import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareMetricCard } from "../components/HardwareMetricCard";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useSmartMeterDashboard } from "../hooks/useSmartMeterDashboard";
import { styles } from "../styles/screens/SmartMeterDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SmartMeterDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: dashboard, isLoading } = useSmartMeterDashboard();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_2d0eb50445dd}</Text>
          <Pressable onPress={() => navigation.navigate('MeterReadingImportPlaceholder')} style={styles.addButton}>
            <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary}/>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_1c5c318f867b}</Text>) : (<View style={styles.metricsRow}>
              <HardwareMetricCard label={localizedUiText.m_9b68be859034} value={dashboard?.totalMeters || 0}/>
              <HardwareMetricCard label={localizedUiText.m_0d21bd52022c} value={dashboard?.onlineMetersCount || 0} color={Colors.success}/>
              <HardwareMetricCard label={localizedUiText.m_cb702378f315} value={dashboard?.readingErrorsCount || 0} color={Colors.danger}/>
            </View>)}

          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={() => navigation.navigate('SmartMeterReadingDetail', { meterId: 'dev-028' })}>
              <Text style={styles.buttonText}>{localizedUiText.m_09c630f4c384}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

