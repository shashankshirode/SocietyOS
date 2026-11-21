import { View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle2 } from "./styles/StatusTimeline.styles";
export interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    status: 'completed' | 'active' | 'pending';
}
interface StatusTimelineProps {
    events: TimelineEvent[];
    title?: string;
    style?: ViewStyle;
}
function TimelineNode({ event, index, isLast }: {
    event: TimelineEvent;
    index: number;
    isLast: boolean;
}) {
    const { colors } = useAppTheme();
    const nodeColor = event.status === 'completed' ? colors.success :
        event.status === 'active' ? colors.primary :
            colors.textMuted;
    const lineColor = event.status === 'completed' ? colors.success : colors.border;
    return (<Animated.View entering={FadeInDown.delay(index * 80).duration(350)} style={styles.eventRow}>
      
      <View style={styles.timelineCol}>
        <View style={[styles.dot, createViewBackgroundColorBorderColorStyle(nodeColor, event.status === 'active' ? colors.primary : 'transparent')]}>
          {event.status === 'completed' && (<SafeText variant="tiny" style={styles.safeTextColorFontSizeFontWeight}>✓</SafeText>)}
          {event.status === 'active' && (<View style={[styles.activePulse, createViewBackgroundColorStyle(colors.primary)]}/>)}
        </View>
        {!isLast && <View style={[styles.line, createViewBackgroundColorStyle2(lineColor)]}/>}
      </View>

      
      <View style={styles.eventContent}>
        <SafeText variant="bodyStrong" color={event.status === 'pending' ? 'muted' : 'primary'} numberOfLines={1}>
          {event.title}
        </SafeText>
        {event.description && (<SafeText variant="caption" color="muted" numberOfLines={2}>{event.description}</SafeText>)}
        <SafeText variant="tiny" color="muted" style={styles.timestamp}>{event.timestamp}</SafeText>
      </View>
    </Animated.View>);
}
export function StatusTimeline({ events, title, style }: StatusTimelineProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border), style]}>
      {title && <SafeText variant="bodyStrong" color="primary" style={styles.sectionTitle}>{title}</SafeText>}
      {events.map((event, i) => (<TimelineNode key={event.id} event={event} index={i} isLast={i === events.length - 1}/>))}
    </View>);
}

