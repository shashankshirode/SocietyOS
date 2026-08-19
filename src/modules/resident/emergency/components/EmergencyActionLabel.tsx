import { Animated } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createAnimatedViewOpacityTransformBackgroundColorBorderColorStyle, createAnimatedViewScaleStyle } from "../styles/components/EmergencyActionLabel.styles";
type EmergencyActionLabelProps = {
    text: string;
    opacity: Animated.AnimatedInterpolation<number>;
    scale: Animated.AnimatedInterpolation<number>;
};
export function EmergencyActionLabel({ text, opacity, scale }: EmergencyActionLabelProps) {
    const { colors } = useAppTheme();
    return (<Animated.View style={[
            styles.container,
            createAnimatedViewOpacityTransformBackgroundColorBorderColorStyle(opacity, [createAnimatedViewScaleStyle(scale)], colors.surface, colors.border),
        ]}>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(colors.textPrimary)]}>
        {text}
      </SafeText>
    </Animated.View>);
}
export default EmergencyActionLabel;

