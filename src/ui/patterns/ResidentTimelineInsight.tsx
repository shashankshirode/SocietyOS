import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/ResidentTimelineInsight.styles";
export interface TimelineItem {
    id: string;
    title: string;
    timestamp: string;
    description?: string;
}
export interface ResidentTimelineInsightProps {
    items: TimelineItem[];
}
export function ResidentTimelineInsight({ items }: ResidentTimelineInsightProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const lineColor = dark ? '#253149' : '#E5E7EB';
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.timelineInsight}>
      {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<View key={item.id} style={styles.row}>
            <View style={styles.leftCol}>
              <View style={[styles.dot, createViewBackgroundColorStyle(colors.primary)]}/>
              {!isLast && <View style={[styles.line, createViewBackgroundColorStyle2(lineColor)]}/>}
            </View>

            <View style={styles.rightCol}>
              <View style={styles.header}>
                <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
                  {item.title}
                </SafeText>
                <SafeText variant="tiny" color="muted">
                  {item.timestamp}
                </SafeText>
              </View>
              {item.description && (<SafeText variant="tiny" color="secondary" style={styles.description}>
                  {item.description}
                </SafeText>)}
            </View>
          </View>);
        })}
    </View>);
}

