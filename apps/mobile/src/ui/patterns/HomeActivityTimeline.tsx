import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { HomeActivityItem, ActivityModule } from "../../modules/resident/dashboard/data/dashboard.types";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/HomeActivityTimeline.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export interface HomeActivityTimelineProps {
    activities: HomeActivityItem[];
    onActivityPress: (id: string) => void;
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
const moduleColors: Record<ActivityModule, {
    light: string;
    dark: string;
}> = {
    visitor: { light: '#2563EB', dark: '#60A5FA' },
    billing: { light: '#059669', dark: '#34D399' },
    complaint: { light: '#D97706', dark: '#FBBF24' },
    notice: { light: '#7C3AED', dark: '#A78BFA' },
    document: { light: '#0891B2', dark: '#22D3EE' },
    facility: { light: '#4338CA', dark: '#818CF8' },
    emergency: { light: '#DC2626', dark: '#F87171' },
    residentConnect: { light: '#0284C7', dark: '#38BDF8' }
};
export function HomeActivityTimeline({ activities, onActivityPress }: HomeActivityTimelineProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const reducedMotion = useReducedMotion();
    const lineColor = dark ? '#253149' : '#E5E7EB';
    return (<View style={styles.container}>
      <DashboardSectionHeader title={localizedUiText.m_9ef7d438ce5b}/>

      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, dark ? colors.border : '#E5E7EB')]}>
        {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            const iconName = moduleIcons[activity.module];
            const iconColor = dark ? moduleColors[activity.module].dark : moduleColors[activity.module].light;
            const nodeBg = dark ? `${iconColor}22` : `${iconColor}0F`;
            return (<Animated.View key={activity.id} {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(250))}>
              <PressableScale onPress={() => onActivityPress(activity.id)}>
                <View style={[styles.item, isLast ? styles.viewMinHeight : null]}>
                  
                  <View style={styles.timelineLeft}>
                    <View style={[styles.node, createViewBackgroundColorStyle(nodeBg)]}>
                      <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={14} color={iconColor}/>
                    </View>
                    {!isLast && <View style={[styles.line, createViewBackgroundColorStyle2(lineColor)]}/>}
                  </View>

                  
                  <View style={[styles.content, isLast ? styles.viewPaddingBottom : null]}>
                    <View style={styles.contentHeader}>
                      <SafeText variant="caption" color="primary" numberOfLines={1} style={styles.safeTextFontWeightFlex}>
                        {activity.title}
                      </SafeText>
                      <SafeText variant="tiny" color="muted">{activity.timestampLabel}</SafeText>
                    </View>
                    <SafeText variant="tiny" color="secondary" numberOfLines={2}>
                      {activity.description}
                    </SafeText>
                  </View>
                </View>
              </PressableScale>
            </Animated.View>);
        })}
      </View>
    </View>);
}

