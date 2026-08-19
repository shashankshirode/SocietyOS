import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { PressableScale } from "../../../../../shared/motion/PressableScale";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { dailyInsightMessages } from "../../../../../messages/en/residentDashboard.messages";
import { styles, createViewBorderBottomColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2, createPressableScaleBackgroundColorStyle } from "../../styles/components/insights/DailyInsightsHeader.styles";
export interface DailyInsightsHeaderProps {
    onClose: () => void;
    onReportPress?: () => void;
}
export function DailyInsightsHeader({ onClose, onReportPress }: DailyInsightsHeaderProps) {
    const { colors } = useAppTheme();
    const titleText = dailyInsightMessages.sheet.title;
    const subtitleText = dailyInsightMessages.sheet.subtitle;
    const closeAccessibility = dailyInsightMessages.sheet.close;
    return (<View style={[styles.container, createViewBorderBottomColorStyle(colors.border)]}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle(colors.textPrimary)]}>
            {titleText}
          </SafeText>
          <SafeText variant="caption" style={[styles.subtitle, createSafeTextColorStyle2(colors.textSecondary)]}>
            {subtitleText}
          </SafeText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onReportPress && (
            <PressableScale
              onPress={onReportPress}
              accessibilityRole="button"
              accessibilityLabel="Report Daily Insight"
              style={[styles.closeBtn, createPressableScaleBackgroundColorStyle(colors.primarySoft)]}
              testID="daily-insights-report-btn"
            >
              <Ionicons name="add" size={20} color={colors.primary} />
            </PressableScale>
          )}

          <PressableScale onPress={onClose} accessibilityRole="button" accessibilityLabel={closeAccessibility} style={[styles.closeBtn, createPressableScaleBackgroundColorStyle(colors.backgroundSoft)]} testID="daily-insights-close-btn">
            <Ionicons name="close" size={22} color={colors.textPrimary}/>
          </PressableScale>
        </View>
      </View>
    </View>);
}
export default DailyInsightsHeader;

