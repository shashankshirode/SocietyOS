import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { HardwareDevice } from "../../../shared/types/hardware.types";
import { styles } from "../styles/components/HardwareDeviceCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface Props {
    device: HardwareDevice;
    onPress: () => void;
}
export function HardwareDeviceCard({ device, onPress }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{device.name}</Text>
        <StatusBadge moduleType="hardware" status={device.status}/>
      </View>
      <Text style={styles.code}>{device.deviceCode} • {device.type}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{localizedUiText.m_bbdffe25dc7d + " "}{device.location}</Text>
        <Text style={styles.footerText}>{localizedUiText.m_3d1dd7233f94 + " "}{device.vendor}</Text>
      </View>
    </AppCard>);
}

