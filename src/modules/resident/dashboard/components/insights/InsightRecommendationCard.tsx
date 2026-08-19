import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useReducedMotion } from "../../../../../shared/motion/useReducedMotion";
import { dailyInsightMessages } from "../../../../../messages/en/residentDashboard.messages";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createAnimatedViewBackgroundColorBorderColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2 } from "../../styles/components/insights/InsightRecommendationCard.styles";
export interface InsightRecommendationCardProps {
    recommendation?: string;
}
export function InsightRecommendationCard({ recommendation }: InsightRecommendationCardProps) {
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    if (!recommendation)
        return null;
    const titleText = dailyInsightMessages.sheet.recommendedAction;
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(90).duration(240))} style={[
            styles.container,
            createAnimatedViewBackgroundColorBorderColorStyle(colors.primarySoft, colors.border),
        ]} testID="insight-recommendation-panel">
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={14} color={colors.primary}/>
        <SafeText variant="tiny" style={[styles.title, createSafeTextColorStyle(colors.primary)]}>
          {titleText}
        </SafeText>
      </View>
      <SafeText variant="caption" style={[styles.text, createSafeTextColorStyle2(colors.textPrimary)]}>
        {recommendation}
      </SafeText>
    </Animated.View>);
}
export default InsightRecommendationCard;

