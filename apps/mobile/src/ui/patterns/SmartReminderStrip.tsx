import { ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import type { SmartReminder, ReminderSeverity } from "../../modules/resident/dashboard/data/dashboard.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { styles, createScrollViewPaddingHorizontalStyle, createViewBackgroundColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3 } from "./styles/SmartReminderStrip.styles";
export interface SmartReminderStripProps {
    reminders: SmartReminder[];
    onReminderPress: (id: string) => void;
    contentPadding?: number;
}
const severityConfig: Record<ReminderSeverity, {
    icon: string;
    lightBg: string;
    darkBg: string;
    lightText: string;
    darkText: string;
    lightAccent: string;
    darkAccent: string;
}> = {
    info: {
        icon: "information-circle",
        lightBg: "#EFF6FF",
        darkBg: "#1E3A5F",
        lightText: "#1E40AF",
        darkText: "#93C5FD",
        lightAccent: "#3B82F6",
        darkAccent: "#60A5FA",
    },
    warning: {
        icon: "warning",
        lightBg: "#FFFBEB",
        darkBg: "#451A03",
        lightText: "#92400E",
        darkText: "#FCD34D",
        lightAccent: "#F59E0B",
        darkAccent: "#FBBF24",
    },
    danger: {
        icon: "alert-circle",
        lightBg: "#FEF2F2",
        darkBg: "#450A0A",
        lightText: "#991B1B",
        darkText: "#FCA5A5",
        lightAccent: "#EF4444",
        darkAccent: "#F87171",
    },
    success: {
        icon: "checkmark-circle",
        lightBg: "#F0FDF4",
        darkBg: "#052E16",
        lightText: "#166534",
        darkText: "#86EFAC",
        lightAccent: "#22C55E",
        darkAccent: "#4ADE80",
    },
};
export function SmartReminderStrip({ reminders, onReminderPress, contentPadding, }: SmartReminderStripProps) {
    const { dark } = useAppTheme();
    const { screenPadding } = useResponsiveLayout();
    const padding = contentPadding ?? screenPadding;
    if (reminders.length === 0)
        return null;
    return (<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[
            styles.scrollContent,
            createScrollViewPaddingHorizontalStyle(padding),
        ]} style={styles.container}>
      {reminders.map((reminder) => {
            const config = severityConfig[reminder.severity];
            const bg = dark ? config.darkBg : config.lightBg;
            const text = dark ? config.darkText : config.lightText;
            const accent = dark ? config.darkAccent : config.lightAccent;
            return (<PressableScale key={reminder.id} onPress={() => onReminderPress(reminder.id)}>
            <View style={[styles.card, createViewBackgroundColorStyle(bg)]}>
              <View style={styles.cardTop}>
                <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={16} color={accent}/>
                <SafeText variant="caption" style={[styles.title, createSafeTextColorStyle(text)]} numberOfLines={1}>
                  {reminder.title}
                </SafeText>
              </View>
              <SafeText variant="tiny" style={[styles.desc, createSafeTextColorStyle2(text)]} numberOfLines={2}>
                {reminder.description}
              </SafeText>
              <SafeText variant="tiny" style={[styles.action, createSafeTextColorStyle3(accent)]}>
                {reminder.actionLabel} →
              </SafeText>
            </View>
          </PressableScale>);
        })}
    </ScrollView>);
}

