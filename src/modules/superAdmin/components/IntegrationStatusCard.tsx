import { Text, View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/components/IntegrationStatusCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface IntegrationStatusCardProps {
    name: string;
    category: string;
    status: string;
    provider?: string;
    failures?: number;
    affected?: number;
}
export function IntegrationStatusCard({ name, category, status, provider, failures = 0, affected = 0 }: IntegrationStatusCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category} {provider ? `• ${provider}` : ''}</Text>
        </View>
        <StatusBadge status={status} moduleType="platform"/>
      </View>

      {(failures > 0 || affected > 0) && (<View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.label}>{localizedUiText.m_7bd31a025d29}</Text>
            <Text style={[styles.value, styles.danger]}>{failures}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.label}>{localizedUiText.m_6fbf98d0c41f}</Text>
            <Text style={styles.value}>{affected}</Text>
          </View>
        </View>)}
    </AppCard>);
}

