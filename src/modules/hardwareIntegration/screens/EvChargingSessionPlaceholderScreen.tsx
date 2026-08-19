import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { styles } from "../styles/screens/EvChargingSessionPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function EvChargingSessionPlaceholderScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { sessionId } = route.params;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_061826898cf5}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_cb9ac5c561da}</Text>
              <Text style={styles.value}>{sessionId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_280eda6fb8fa}</Text>
              <Text style={styles.value}>{localizedUiText.m_8a5d554e4b1c}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_8ec6f42c4090}</Text>
              <Text style={styles.value}>{localizedUiText.m_24c69872cb47}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_57c8177ac1f3}</Text>
              <Text style={styles.value}>{localizedUiText.m_30cc7ce298ef}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_ff9bc45659b9}</Text>
              <Text style={styles.value}>{localizedUiText.m_1c7e59ae94e0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_c4554b3210fb}</Text>
              <Text style={styles.value}>₹277.50</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
              <StatusBadge moduleType="evcharging" status="IN_PROGRESS"/>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

