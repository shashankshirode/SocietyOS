import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { HardwareErrorRecord } from "../../../shared/types/hardware.types";
import { styles } from "../styles/components/HardwareErrorCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareErrorCard({ error }: {
    error: HardwareErrorRecord;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{error.errorType.replace(/_/g, ' ')}</Text>
        <StatusBadge moduleType="hardware" status={error.status}/>
      </View>
      <Text style={styles.device}>{localizedUiText.m_9f8d3539c6f3 + " "}{error.deviceName}</Text>
      <Text style={styles.message}>{error.message}</Text>
      <Text style={styles.action}>{localizedUiText.m_ab970ed3d5c2 + " "}{error.suggestedAction}</Text>
    </AppCard>);
}

