import { View, StyleProp, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewHeightBackgroundColorBorderRadiusStyle, createViewWidthHeightBackgroundColorBorderRadiusStyle } from "./styles/ProgressBar.styles";
export interface ProgressBarProps {
    progress: number;
    color?: string;
    backgroundColor?: string;
    height?: number;
    style?: StyleProp<ViewStyle>;
}
export function ProgressBar({ progress, color, backgroundColor, height = 8, style, }: ProgressBarProps) {
    const { colors } = useAppTheme();
    const finalColor = color || colors.primary;
    const finalBgColor = backgroundColor || colors.border;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    return (<View style={[
            styles.container,
            createViewHeightBackgroundColorBorderRadiusStyle(height, finalBgColor, height / 2),
            style,
        ]}>
      <View style={[
            styles.fill,
            createViewWidthHeightBackgroundColorBorderRadiusStyle(`${clampedProgress * 100}%`, height, finalColor, height / 2),
        ]}/>
    </View>);
}
export default ProgressBar;

