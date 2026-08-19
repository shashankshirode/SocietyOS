import { View, ViewStyle } from "react-native";
import { SafeText } from "./SafeText";
import { statusColors, type StatusTone } from "../theme/statusColors";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle } from "./styles/StatusPill.styles";
type StatusPillProps = {
    label: string;
    tone?: StatusTone;
    style?: ViewStyle;
};
export function StatusPill({ label, tone = 'neutral', style }: StatusPillProps) {
    const { mode } = useAppTheme();
    const colors = statusColors[mode][tone];
    return (<View style={[styles.pill, createViewBackgroundColorBorderColorStyle(colors.background, colors.border), style]}>
      <SafeText variant="tiny" color={colors.text} numberOfLines={2} align="center">{label}</SafeText>
    </View>);
}

