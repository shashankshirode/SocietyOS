import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle } from "./styles/GlassCard.styles";
export interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export function GlassCard({ children, style }: GlassCardProps) {
    const { dark } = useAppTheme();
    return (<View style={[
            styles.card,
            createViewBackgroundColorBorderColorStyle(dark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)', dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'),
            style,
        ]}>
      {children}
    </View>);
}
export default GlassCard;

