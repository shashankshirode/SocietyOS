import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BiometricDevice } from "../../../shared/types/biometric.types";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/BiometricDeviceCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface BiometricDeviceCardProps {
    device: BiometricDevice;
    onPress: () => void;
}
export function BiometricDeviceCard({ device, onPress }: BiometricDeviceCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getSyncTypeLabel = (type: string) => {
        return type.replace(/_/g, ' ');
    };
    return (<Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="hardware-chip-outline" size={20} color={Colors.primary} style={styles.icon}/>
          <View>
            <Text style={styles.name}>{device.deviceName}</Text>
            <Text style={styles.code}>{device.deviceCode} · {device.vendorName}</Text>
          </View>
        </View>
        <StatusBadge status={device.status} moduleType="parking"/>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{device.location}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="sync-outline" size={14} color={Colors.neutral}/>
          <Text style={styles.detailText}>{localizedUiText.m_8c7b979c3907 + " "}{getSyncTypeLabel(device.syncType)}</Text>
        </View>
        {device.lastSyncTime && (<View style={styles.row}>
            <Ionicons name="time-outline" size={14} color={Colors.neutral}/>
            <Text style={styles.detailText}>{localizedUiText.m_cfd7bc10a69f + " "}{new Date(device.lastSyncTime).toLocaleString()}</Text>
          </View>)}
      </View>

      <View style={styles.footer}>
        <Text style={styles.stats}>{localizedUiText.m_173fb6ec32af + " "}{device.mappedStaffCount}{" " + localizedUiText.m_41be6374c376 + " "}{device.recentErrorCount}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.neutral}/>
      </View>
    </Pressable>);
}

