import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { HardwareWarningBanner } from "../components/HardwareWarningBanner";
import { useHardwareDeviceDetail } from "../hooks/useHardwareDeviceDetail";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HardwareIntegrationStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/HardwareDeviceDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareDeviceDetailScreen({ route, navigation }: NativeStackScreenProps<HardwareIntegrationStackParamList, 'HardwareDeviceDetail'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { deviceId } = route.params;
    const { data: device, isLoading } = useHardwareDeviceDetail(deviceId);
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_2f2e1530d1eb}</Text>
          <View style={styles.viewWidth}/>
        </View>

        {isLoading || !device ? (<Text style={styles.loading}>{localizedUiText.m_eefe44fd0c3e}</Text>) : (<ScrollView contentContainerStyle={styles.scroll}>
            <HardwareWarningBanner />

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_dcd1d5223f73}</Text>
                <Text style={styles.value}>{device.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_baaddf70fb5d}</Text>
                <Text style={styles.value}>{device.type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_ae6aa1054f18}</Text>
                <Text style={styles.value}>{device.deviceCode}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_f8aa82b42d07}</Text>
                <Text style={styles.value}>{device.vendor}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_15b61974b270}</Text>
                <Text style={styles.value}>{device.location}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_920e413c7d41}</Text>
                <StatusBadge moduleType="hardware" status={device.status}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{localizedUiText.m_e97513d03b59}</Text>
                <Text style={styles.value}>{device.linkedModule}</Text>
              </View>
              {device.lastHeartbeat && (<View style={styles.row}>
                  <Text style={styles.label}>{localizedUiText.m_d591d3458ab8}</Text>
                  <Text style={styles.value}>{new Date(device.lastHeartbeat).toLocaleString()}</Text>
                </View>)}
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('DeviceLocationMapping')}>
                <Text style={styles.buttonSecondaryText}>{localizedUiText.m_23bd3d9ad264}</Text>
              </Pressable>
              <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('HardwareEventLogs', { deviceId: device.id })}>
                <Text style={styles.buttonSecondaryText}>{localizedUiText.m_3c177274ddb4}</Text>
              </Pressable>
              <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('HardwareSyncJobLogs', { deviceId: device.id })}>
                <Text style={styles.buttonSecondaryText}>{localizedUiText.m_12ddf2651741}</Text>
              </Pressable>
            </View>
          </ScrollView>)}
      </SafeAreaView>
    </ScreenContainer>);
}

