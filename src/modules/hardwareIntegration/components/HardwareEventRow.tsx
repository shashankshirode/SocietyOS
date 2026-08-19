import { Text, View } from "react-native";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { HardwareEvent } from "../../../shared/types/hardware.types";
import { styles } from "../styles/components/HardwareEventRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareEventRow({ event }: {
    event: HardwareEvent;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{event.eventType.replace(/_/g, ' ')}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_9f8d3539c6f3 + " "}{event.deviceName}</Text>
        <Text style={styles.time}>{new Date(event.timestamp).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.right}>
        <StatusBadge moduleType="hardware" status={event.status}/>
      </View>
    </View>);
}

