import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useReducedMotion } from "../../../../../shared/motion/useReducedMotion";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createAnimatedViewBackgroundColorBorderColorStyle, createSafeTextColorStyle } from "../../styles/components/insights/InsightInfoSection.styles";
export interface InsightInfoSectionProps {
    explanation?: string;
    impactSummary?: string;
}
export function InsightInfoSection({ explanation }: InsightInfoSectionProps) {
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    if (!explanation)
        return null;
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(50).duration(200))} style={[
            styles.container,
            createAnimatedViewBackgroundColorBorderColorStyle(colors.surfaceMuted, colors.border),
        ]} testID="insight-explanation-panel">
      <SafeText variant="caption" style={[styles.text, createSafeTextColorStyle(colors.textSecondary)]}>
        {explanation}
      </SafeText>
    </Animated.View>);
}
export default InsightInfoSection;

