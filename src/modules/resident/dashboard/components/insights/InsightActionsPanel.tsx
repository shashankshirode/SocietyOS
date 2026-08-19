import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../../../../shared/components/SafeText";
import { PressableScale } from "../../../../../shared/motion/PressableScale";
import { useReducedMotion } from "../../../../../shared/motion/useReducedMotion";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import type { DailyInsightActionViewModel } from "../../../contextualInsights/data/dailyInsight.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createPressableScaleBackgroundColorStyle, createPressableScaleBackgroundColorBorderColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2 } from "../../styles/components/insights/InsightActionsPanel.styles";
export interface InsightActionsPanelProps {
    actions: DailyInsightActionViewModel[];
    onAction: (actionName: DailyInsightActionViewModel['action']) => void;
}
export function InsightActionsPanel({ actions, onAction }: InsightActionsPanelProps) {
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    const buttonActions = actions.filter((act) => act.type !== 'link');
    if (buttonActions.length === 0)
        return null;
    return (<Animated.View {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(130).duration(240))} style={styles.container}>
      <View style={styles.buttonRow}>
        {buttonActions.map((act) => {
            const isPrimary = act.type === 'primary';
            return (<PressableScale key={act.id} style={[
                    styles.btn,
                    isPrimary
                        ? createPressableScaleBackgroundColorStyle(colors.primary) : createPressableScaleBackgroundColorBorderColorStyle(colors.surfaceRaised, colors.border),
                ]} onPress={() => onAction(act.action)} accessibilityRole="button" accessibilityLabel={act.label} testID={`insight-action-${act.action}`}>
              <SafeText variant="bodyStrong" style={[
                    styles.btnText,
                    isPrimary
                        ? createSafeTextColorStyle(colors.textInverse) : createSafeTextColorStyle2(colors.textPrimary),
                ]}>
                {act.label}
              </SafeText>
            </PressableScale>);
        })}
      </View>
    </Animated.View>);
}
export default InsightActionsPanel;

