import { ScrollView, Text, View, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useBoomBarrierPlaceholder } from "../hooks/useBoomBarrierPlaceholder";
import { styles } from "../styles/screens/BoomBarrierPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
export function BoomBarrierPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: barriers, isLoading } = useBoomBarrierPlaceholder();
    const handleManualOverride = (name: string) => {
        AppAlert.alert(String(localizedUiText.m_9d8964691963), formatUiLiteral(String(localizedUiText.m_8fa475e481a9), [name]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_2fa05080a2a2),
                onPress: () => {
                    AppAlert.alert(String(localizedUiText.m_3fbb039bb986), String(localizedUiText.m_cd28a2ed38eb));
                }
            }
        ]);
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_c1f6dc886c8c}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_7a8da54f6dd6}</Text>) : ((barriers || []).map(b => (<View key={b.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.name}>{b.name}</Text>
                  <StatusBadge moduleType="gatehardware" status={b.status}/>
                </View>
                <Text style={styles.text}>{localizedUiText.m_5f09e1f74a6d + " "}{b.deviceCode}{" " + localizedUiText.m_a6f0aff5052a + " "}{b.location}</Text>
                <Text style={styles.text}>{localizedUiText.m_f0746ac9355e + " "}{b.deniedCount}</Text>
                {b.lastOpenTime && <Text style={styles.time}>{localizedUiText.m_4390410ee208 + " "}{new Date(b.lastOpenTime).toLocaleTimeString()}</Text>}

                <Pressable style={styles.overrideButton} onPress={() => handleManualOverride(b.name)}>
                  <Text style={styles.overrideButtonText}>{localizedUiText.m_5465110903f1}</Text>
                </Pressable>
              </View>)))}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

