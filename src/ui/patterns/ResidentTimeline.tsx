import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle3 } from "./styles/ResidentTimeline.styles";
export interface ResidentTimelineItem {
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    iconName?: string;
    status?: string;
    statusTone?: StatusTone;
}
export interface ResidentTimelineProps {
    items: ResidentTimelineItem[];
}
export function ResidentTimeline({ items }: ResidentTimelineProps) {
    const theme = useResidentTheme();
    return (<View style={styles.container}>
      {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (<View key={item.id} style={styles.timelineItem}>
            
            <View style={styles.leftCol}>
              <View style={[styles.node, createViewBackgroundColorStyle(theme.accentSoft)]}>
                <Ionicons name={(item.iconName || 'ellipse') as keyof typeof Ionicons.glyphMap} size={12} color={theme.accent}/>
              </View>
              {!isLast && <View style={[styles.line, createViewBackgroundColorStyle2(theme.border)]}/>}
            </View>

            
            <View style={[styles.contentCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
              <View style={styles.cardHeader}>
                <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle3(theme.textPrimary)]} numberOfLines={1}>
                  {item.title}
                </SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>
                  {item.timestamp}
                </SafeText>
              </View>
              {item.description && (<SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
                  {item.description}
                </SafeText>)}
              {item.status && (<View style={styles.pillContainer}>
                  <StatusPill label={item.status} tone={item.statusTone || 'neutral'} small/>
                </View>)}
            </View>
          </View>);
        })}
    </View>);
}
export default ResidentTimeline;

