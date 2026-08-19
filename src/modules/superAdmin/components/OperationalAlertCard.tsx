import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { PlatformOperationalAlert } from "../../../shared/types/platform.types";
import { styles } from "../styles/components/OperationalAlertCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface OperationalAlertCardProps {
    alert: PlatformOperationalAlert;
    onPress: () => void;
}
export function OperationalAlertCard({ alert, onPress }: OperationalAlertCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getSeverityIcon = () => {
        switch (alert.severity) {
            case 'CRITICAL': return 'alert-circle';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'information-circle';
            default: return 'flag';
        }
    };
    const getSeverityColor = () => {
        switch (alert.severity) {
            case 'CRITICAL': return Colors.danger;
            case 'HIGH': return Colors.dangerLight;
            case 'MEDIUM': return Colors.warning;
            default: return Colors.success;
        }
    };
    return (<AppCard pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={getSeverityIcon()} size={20} color={getSeverityColor()}/>
          <Text style={styles.alertType}>{alert.type.replace(/_/g, ' ')}</Text>
        </View>
        <StatusBadge status={alert.status} moduleType="platform"/>
      </View>

      <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>

      <View style={styles.footer}>
        <Text style={styles.society}>
          {alert.societyName || localizedUiText.m_6693cd970508}
        </Text>
        <Text style={styles.date}>
          {new Date(alert.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </AppCard>);
}

