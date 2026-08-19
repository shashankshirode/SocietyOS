import { useEffect } from "react";
import { Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";
import { useReducedMotion } from "./useReducedMotion";
import { styles, createAnimatedViewBackgroundColorStyle, createTextColorStyle } from "./styles/PulseBadge.styles";
type PulseBadgeProps = {
    label: string;
    tone?: 'info' | 'success' | 'warning' | 'danger';
};
export function PulseBadge({ label, tone = 'info' }: PulseBadgeProps) {
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    const scale = useSharedValue(1);
    useEffect(() => {
        if (!reducedMotion) {
            scale.value = withRepeat(withSequence(withTiming(1.04, { duration: 700 }), withTiming(1, { duration: 700 })), -1, false);
        }
    }, [reducedMotion, scale]);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const colorMap = {
        info: [colors.info, colors.infoSoft],
        success: [colors.success, colors.successSoft],
        warning: [colors.warning, colors.warningSoft],
        danger: [colors.danger, colors.dangerSoft],
    } as const;
    return (<Animated.View style={[styles.badge, createAnimatedViewBackgroundColorStyle(colorMap[tone][1]), animatedStyle]}>
      <Text style={[styles.text, createTextColorStyle(colorMap[tone][0])]}>{label}</Text>
    </Animated.View>);
}

