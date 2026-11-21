import { Text, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewWidthHeightBorderRadiusBorderColorBorderTopColorBorderRightCStyle, createTextColorStyle, createTextColorStyle2 } from "./styles/AnimatedProgressRing.styles";
type AnimatedProgressRingProps = {
    progress: number;
    label?: string;
    size?: number;
    style?: ViewStyle;
};
export function AnimatedProgressRing({ progress, label, size = 72, style }: AnimatedProgressRingProps) {
    const { colors } = useAppTheme();
    const clamped = Math.max(0, Math.min(100, progress));
    return (<View style={[
            styles.ring,
            createViewWidthHeightBorderRadiusBorderColorBorderTopColorBorderRightCStyle(size, size, size / 2, colors.primarySoft, colors.primary, clamped > 25 ? colors.primary : colors.primarySoft, clamped > 50 ? colors.primary : colors.primarySoft, clamped > 75 ? colors.primary : colors.primarySoft),
            style,
        ]}>
      <Text style={[styles.value, createTextColorStyle(colors.textPrimary)]}>{clamped}%</Text>
      {label ? <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]} numberOfLines={1}>{label}</Text> : null}
    </View>);
}

