import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import type { ActivityModule, HomeActivityItem } from "../../modules/resident/dashboard/data/dashboard.types";
import { DashboardSectionHeader } from "../components/SectionHeader";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBorderTopColorStyle, createViewBackgroundColorStyle } from "./styles/ResidentCompactActivityTimeline.styles";
export interface ResidentCompactActivityTimelineProps {
    title: string;
    subtitle: string;
    activities: HomeActivityItem[];
    onActivityPress: (id: string) => void;
    viewAllLabel?: string;
    onViewAllPress?: () => void;
    emptyTitle?: string;
    emptyDescription?: string;
}
const moduleIcons: Record<ActivityModule, keyof typeof Ionicons.glyphMap> = {
    visitor: 'people-outline',
    billing: 'receipt-outline',
    complaint: 'chatbox-ellipses-outline',
    notice: 'megaphone-outline',
    document: 'folder-open-outline',
    facility: 'calendar-outline',
    emergency: 'alert-circle-outline',
    residentConnect: 'chatbubbles-outline'
};
export function ResidentCompactActivityTimeline({ title, subtitle, activities, onActivityPress, viewAllLabel, onViewAllPress, emptyTitle, emptyDescription, }: ResidentCompactActivityTimelineProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container} testID="resident-compact-activity-timeline">
      <DashboardSectionHeader title={title} subtitle={subtitle} {...includeWhenPresent("actionLabel", viewAllLabel)} {...includeWhenPresent("onActionPress", onViewAllPress)}/>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
        {activities.length === 0 ? (<View style={styles.empty}>
            <Ionicons name="time-outline" size={28} color={colors.textMuted}/>
            {emptyTitle ? <SafeText variant="bodyStrong" color="primary">{emptyTitle}</SafeText> : null}
            {emptyDescription ? <SafeText variant="caption" color="muted" align="center">{emptyDescription}</SafeText> : null}
          </View>) : activities.map((activity, index) => (<PressableScale key={activity.id} onPress={() => onActivityPress(activity.id)}>
            {activity.dateGroupLabel && activity.dateGroupLabel !== activities[index - 1]?.dateGroupLabel ? (<SafeText variant="tiny" color="muted" style={styles.dateGroup}>{activity.dateGroupLabel}</SafeText>) : null}
            <View style={[styles.row, index > 0 ? createViewBorderTopColorStyle(colors.border) : null]}> 
              <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.surfaceElevated)]}>
                <Ionicons name={moduleIcons[activity.module]} size={16} color={colors.primary}/>
              </View>
              <View style={styles.textBlock}>
                <View style={styles.rowHeader}>
                  <SafeText variant="caption" color="primary" numberOfLines={1} style={styles.title}>
                    {activity.title}
                  </SafeText>
                  <SafeText variant="tiny" color="muted" numberOfLines={1} style={styles.time}>
                    {activity.timestampLabel}
                  </SafeText>
                </View>
                <SafeText variant="tiny" color="secondary" numberOfLines={2}>
                  {activity.description}
                </SafeText>
              </View>
            </View>
          </PressableScale>))}
      </View>
    </View>);
}

