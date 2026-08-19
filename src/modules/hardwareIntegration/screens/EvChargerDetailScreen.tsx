import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useEvChargerDetail } from "../hooks/useEvChargerDetail";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HardwareIntegrationStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/EvChargerDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function EvChargerDetailScreen({ route, navigation }: NativeStackScreenProps<HardwareIntegrationStackParamList, 'EvChargerDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { chargerId } = route.params;
    const { data: charger, isLoading } = useEvChargerDetail(chargerId);
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_4a304593a0e3}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading || !charger ? (<Text style={styles.loading}>{localizedUiText.m_eefe44fd0c3e}</Text>) : (<ScrollView contentContainerStyle={styles.scroll}>
            <HardwareWarningBanner />

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_dcd1d5223f73}</Text>
                <Text style={styles.value}>{charger.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_340f463033e0}</Text>
                <Text style={styles.value}>{charger.chargerCode}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_15b61974b270}</Text>
                <Text style={styles.value}>{charger.location}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_69e7dce9ffe7}</Text>
                <Text style={styles.value}>{charger.connectorType}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
                <StatusBadge moduleType="evcharging" status={charger.status}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_318ff47680e6}</Text>
                <Text style={styles.value}>{charger.totalEnergyDeliveredKwh}{" " + localizedUiText.m_58520857f198}</Text>
              </View>
            </View>

            <Pressable style={styles.button} onPress={() => navigation.navigate('EvChargingSessionPlaceholder', { sessionId: 'evs-001' })}>
              <Text style={styles.buttonText}>{localizedUiText.m_1f15f1eeb430}</Text>
            </Pressable>
          </ScrollView>)}
      </SafeAreaView>
    </ScreenContainer>);
}

