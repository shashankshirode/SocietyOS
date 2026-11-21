import { Text, View } from "react-native";
import { styles } from "./styles/Timeline.styles";
export interface TimelineEvent {
    title: string;
    subtitle?: string;
    time?: string;
    description?: string;
    isCompleted?: boolean;
}
interface TimelineProps {
    events: TimelineEvent[];
}
export function Timeline({ events }: TimelineProps) {
    if (!events || events.length === 0)
        return null;
    return (<View style={styles.container}>
      {events.map((event, index) => {
            const isLast = index === events.length - 1;
            return (<View key={index} style={styles.row}>
            <View style={styles.leftColumn}>
              <View style={[styles.dot, event.isCompleted && styles.dotCompleted]}/>
              {!isLast && <View style={[styles.line, event.isCompleted && styles.lineCompleted]}/>}
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.textHeader}>
                <Text style={styles.title}>{event.title}</Text>
                {event.time && <Text style={styles.time}>{event.time}</Text>}
              </View>
              {event.subtitle && <Text style={styles.subtitle}>{event.subtitle}</Text>}
              {event.description && <Text style={styles.description}>{event.description}</Text>}
            </View>
          </View>);
        })}
    </View>);
}
export default Timeline;

