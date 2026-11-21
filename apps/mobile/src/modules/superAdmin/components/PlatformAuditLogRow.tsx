import { Text, View } from "react-native";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { PlatformAuditLogEntry } from "../../../shared/types/platform.types";
import { styles } from "../styles/components/PlatformAuditLogRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface PlatformAuditLogRowProps {
    log: PlatformAuditLogEntry;
}
export function PlatformAuditLogRow({ log }: PlatformAuditLogRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.actor}>{log.actorName} ({log.actorRole})</Text>
        <StatusBadge status={log.riskLevel} moduleType="platform"/>
      </View>

      <Text style={styles.event}>{log.event.replace(/_/g, ' ')}</Text>
      <Text style={styles.meta}>{localizedUiText.m_823960a09c43 + " "}{log.entityReference}{" " + localizedUiText.m_3b6ee484592e + " "}{log.correlationId.slice(0, 12)}...</Text>

      <View style={styles.footer}>
        <Text style={styles.society}>
          {log.societyName || localizedUiText.m_6693cd970508}
        </Text>
        <Text style={styles.time}>
          {new Date(log.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>);
}

