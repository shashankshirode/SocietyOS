import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useBiometricConnectorAlignment } from "../hooks/useBiometricConnectorAlignment";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HardwareIntegrationStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/BiometricConnectorAlignmentScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function BiometricConnectorAlignmentScreen({ navigation }: NativeStackScreenProps<HardwareIntegrationStackParamList, 'BiometricConnectorAlignment'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: status, isLoading } = useBiometricConnectorAlignment();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_cfc012650e90}</Text>
          <View style={styles.viewWidth}/>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <HardwareWarningBanner />

          <View style={styles.privacyCard}>
            <Ionicons name="shield-outline" size={24} color={Colors.primary} style={styles.privacyIcon}/>
            <Text style={styles.privacyTitle}>{localizedUiText.m_08ab698e98b3}</Text>
            <Text style={styles.privacyText}>{localizedUiText.m_09455845c362}</Text>
          </View>

          {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_c9564bbc5278}</Text>) : (<View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_26ab6c47c7b7}</Text>
                <Text style={[styles.value, styles.textColor]}>{status?.syncHealth || localizedUiText.m_bed6b78b4fde}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_242806630d46}</Text>
                <Text style={styles.value}>{status?.lastSync ? new Date(status.lastSync).toLocaleString() : localizedUiText.m_e2f79e5b6033}</Text>
              </View>
            </View>)}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

