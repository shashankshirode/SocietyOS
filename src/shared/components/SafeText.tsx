import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { Typography } from "../theme/typography";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorTextAlignStyle } from "./styles/SafeText.styles";
export type SafeTextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'bodyStrong' | 'caption' | 'tiny';
export type SafeTextColor = 'primary' | 'secondary' | 'muted' | 'danger' | 'success' | 'warning' | 'info' | 'inverse';
export type SafeTextProps = TextProps & {
    variant?: SafeTextVariant;
    color?: SafeTextColor | string;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
};
export function SafeText({ variant = 'body', color = 'primary', align = 'left', children, style, numberOfLines, ...props }: SafeTextProps) {
    const { colors } = useAppTheme();
    const tokenColors: Record<SafeTextColor, string> = {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        muted: colors.textMuted,
        danger: colors.danger,
        success: colors.success,
        warning: colors.warning,
        info: colors.info,
        inverse: colors.textInverse,
    };
    const resolvedColor = tokenColors[color as SafeTextColor] ?? color;
    return (<Text {...props} numberOfLines={numberOfLines} ellipsizeMode={numberOfLines ? 'tail' : undefined} style={[styles.base, Typography[variant], createTextColorTextAlignStyle(resolvedColor, align), style]}>
      {children}
    </Text>);
}
export default SafeText;

