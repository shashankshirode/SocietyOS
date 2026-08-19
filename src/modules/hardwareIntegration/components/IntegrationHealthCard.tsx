import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { IntegrationHealthRow } from "../../../shared/types/hardware.types";
import { styles } from "../styles/components/IntegrationHealthCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function IntegrationHealthCard({ row }: {
    row: IntegrationHealthRow;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{row.category}</Text>
        <StatusBadge moduleType="hardware" status={row.status}/>
      </View>
      <View style={styles.stats}>
        <Text style={styles.text}>{localizedUiText.m_6a412f4e8bb4 + " "}{row.deviceCount}</Text>
        <Text style={styles.text}>{localizedUiText.m_26ad32d05564 + " "}{row.onlineCount}</Text>
        <Text style={styles.text}>{localizedUiText.m_05b84fcfff4b + " "}{row.errorCount}</Text>
      </View>
      <Text style={styles.action}>{localizedUiText.m_7d9fda4ea853 + " "}{row.recommendedAction}</Text>
    </AppCard>);
}

