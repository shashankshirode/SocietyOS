import { Text, View, Pressable } from "react-native";
import type { VolunteerAlert } from "../../../../shared/types/volunteer.types";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/components/VolunteerAlertCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    alert: VolunteerAlert;
    onPress: () => void;
}
export function VolunteerAlertCard({ alert, onPress }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.type}>{alert.emergencyType}{" " + localizedUiText.m_44a57b22e03d}</Text>
          <Text style={styles.loc}>{alert.location}</Text>
        </View>
        <StatusBadge status={alert.status} moduleType="parking"/>
      </View>
      <View style={styles.footer}>
        <Text style={styles.time}>{formatResidentTime(alert.alertedAt)}</Text>
        <Text style={styles.severity}>{alert.severity}</Text>
      </View>
    </Pressable>);
}

