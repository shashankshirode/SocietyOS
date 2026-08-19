import { Text, View } from "react-native";
import type { EmergencyTimelineEvent } from "../../../../shared/types/emergency.types";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/components/EmergencyTimeline.styles";
interface Props {
    events: EmergencyTimelineEvent[];
}
export function EmergencyTimeline({ events }: Props) {
    return (<View style={styles.container}>
      {events.map((event, idx) => (<View key={event.id} style={styles.row}>
          <View style={styles.lineBox}>
            <View style={styles.dot}/>
            {idx < events.length - 1 && <View style={styles.line}/>}
          </View>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.actor}>{event.actorName} ({event.actorRole})</Text>
              <Text style={styles.time}>
                {formatResidentTime(event.timestamp)}
              </Text>
            </View>
            <Text style={styles.type}>{event.eventType}</Text>
            {event.note && <Text style={styles.note}>{event.note}</Text>}
          </View>
        </View>))}
    </View>);
}

