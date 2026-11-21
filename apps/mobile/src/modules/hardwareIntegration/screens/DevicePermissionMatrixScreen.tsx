import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { styles } from "../styles/screens/DevicePermissionMatrixScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function DevicePermissionMatrixScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const permissions = [
        { name: 'View Device Registry', roles: getActiveUiLiteral("m_a860ec959179") },
        { name: 'Register Device (Placeholder)', roles: getActiveUiLiteral("m_cce46a82f154") },
        { name: 'Manual Override Boom Barrier', roles: 'SU, SA' },
        { name: 'CCTV Feeds Temporary Access', roles: getActiveUiLiteral("m_054d558fc8d6") },
        { name: 'Smart Meter Reading Views', roles: getActiveUiLiteral("m_586eadad35e5") },
        { name: 'EV Charger Sessions', roles: getActiveUiLiteral("m_b9f70feea6b7") },
    ];
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_49950159643c}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.matrix}>
            <Text style={styles.matrixTitle}>{localizedUiText.m_40e8814d2bd0}</Text>
            {permissions.map((p, idx) => (<View key={idx} style={styles.row}>
                <Text style={styles.permName}>{p.name}</Text>
                <Text style={styles.roles}>{p.roles}</Text>
              </View>))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

