import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useBiometricDeviceDetail } from "../data/useBiometricDeviceDetail";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { AttendancePrivacyNotice } from "../components/AttendancePrivacyNotice";
import { styles } from "../styles/screens/BiometricDeviceDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'BiometricDeviceDetail'>;
export function BiometricDeviceDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { deviceId } = route.params;
    const { device, mappings, isLoading, error, refetch } = useBiometricDeviceDetail(deviceId);
    const handleSync = () => {
        AppAlert.alert(String(localizedUiText.m_169dcd164fc6), String(localizedUiText.m_bbec28b57b58));
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_5e13c7cf8a38}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!device)
        return <ErrorState message={localizedUiText.m_5fa5a35a62b8}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="hardware-chip" size={48} color={Colors.primary}/>
        </View>
        <Text style={styles.name}>{device.deviceName}</Text>
        <Text style={styles.code}>{device.deviceCode} · {device.vendorName}</Text>
        <View style={styles.badges}>
          <StatusBadge status={device.status} moduleType="parking"/>
        </View>
      </View>

      <AttendancePrivacyNotice />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_287e90937fba}</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_15b61974b270}</Text>
            <Text style={styles.value}>{device.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_fa77a5252d38}</Text>
            <Text style={styles.value}>{device.gate || localizedUiText.m_e2f79e5b6033}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_f4e95b05cb38}</Text>
            <Text style={styles.value}>{device.syncType.replace('_', ' ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{localizedUiText.m_3c3de0c91c5f}</Text>
            <Text style={styles.value}>{device.ipAddressMasked || localizedUiText.m_e2f79e5b6033}</Text>
          </View>
          {device.lastSyncTime && (<View style={styles.infoRow}>
              <Text style={styles.label}>{localizedUiText.m_3fcaaebe1b67}</Text>
              <Text style={styles.value}>{new Date(device.lastSyncTime).toLocaleString()}</Text>
            </View>)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_0a52c212e1fc}{mappings.length})</Text>
          <Pressable onPress={() => navigation.navigate('BiometricStaffMapping', { deviceId })}>
            <Text style={styles.linkText}>{localizedUiText.m_d41b26f6fef3}</Text>
          </Pressable>
        </View>
        <View style={styles.infoCard}>
          {mappings.length === 0 ? (<Text style={styles.emptyText}>{localizedUiText.m_fface8104979}</Text>) : (mappings.map((map, idx) => (<View key={idx} style={styles.mappingRow}>
                <View>
                  <Text style={styles.mappingName}>{map.staffName || localizedUiText.m_f3775bd59b10}</Text>
                  <Text style={styles.mappingCode}>{localizedUiText.m_5f09e1f74a6d + " "}{map.biometricEmployeeCode}</Text>
                </View>
                <StatusBadge status={map.status} moduleType="parking"/>
              </View>)))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleSync}>
          <Ionicons name="sync-outline" size={18} color={Colors.white}/>
          <Text style={styles.actionButtonText}>{localizedUiText.m_b343e775d088}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

