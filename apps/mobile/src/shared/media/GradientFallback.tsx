import React from "react";
import { View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewHeightBackgroundColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/GradientFallback.styles";
type GradientFallbackProps = {
    colors?: readonly string[];
    height?: number;
    style?: ViewStyle;
    children?: React.ReactNode;
};
export function GradientFallback({ colors, height = 180, style, children }: GradientFallbackProps) {
    const { colors: themeColors } = useAppTheme();
    const fallback = colors ?? [themeColors.primary, themeColors.accentIndigo, themeColors.accentSky];
    return (<View style={[styles.container, createViewHeightBackgroundColorStyle(height, fallback[0]), style]}>
      <View style={[styles.layerOne, createViewBackgroundColorStyle(fallback[1] ?? fallback[0])]}/>
      <View style={[styles.layerTwo, createViewBackgroundColorStyle2(fallback[2] ?? fallback[0])]}/>
      <View style={styles.content}>{children}</View>
    </View>);
}

