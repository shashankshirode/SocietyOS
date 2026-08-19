import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { EmergencyIncident } from "../../../../shared/types/emergency.types";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { Colors } from "../../../../shared/theme";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/components/EmergencyIncidentCard.styles";
interface Props {
    incident: EmergencyIncident;
    onPress: () => void;
}
export function EmergencyIncidentCard({ incident, onPress }: Props) {
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.incNum}>{incident.incidentNumber}</Text>
          <Text style={styles.typeText}>{incident.emergencyType} · {incident.tower} {incident.flatNumber}</Text>
        </View>
        <StatusBadge status={incident.status} moduleType="parking"/>
      </View>

      <Text style={styles.location} numberOfLines={1}>
        <Ionicons name="location-outline" size={14} color={Colors.textSecondary}/> {incident.location}
      </Text>

      {incident.description && (<Text style={styles.desc} numberOfLines={2}>{incident.description}</Text>)}

      <View style={styles.footer}>
        <Text style={styles.time}>{formatResidentTime(incident.createdAt)}</Text>
        <Text style={styles.severity}>{incident.severity}</Text>
      </View>
    </Pressable>);
}

