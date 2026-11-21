import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "./styles/GradientCard.styles";
export interface GradientCardProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'dark' | 'success' | 'warning' | 'danger' | 'admin' | 'treasurer' | 'guard' | 'facility';
    style?: StyleProp<ViewStyle>;
}
export function GradientCard({ children, variant = 'primary', style }: GradientCardProps) {
    const { colors } = useAppTheme();
    const cardColorMap: Record<string, string> = {
        primary: colors.primary,
        secondary: colors.secondary,
        dark: colors.textPrimary,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        admin: colors.admin || '#7C3AED',
        treasurer: colors.treasurer || '#B45309',
        guard: colors.guard || '#0F766E',
        facility: colors.facility || '#2563EB',
    };
    const accentColorMap: Record<string, string> = {
        primary: colors.primaryPressed,
        secondary: colors.secondarySoft,
        dark: colors.primarySoft,
        success: colors.successSoft,
        warning: colors.warningSoft,
        danger: colors.dangerSoft,
        admin: colors.primarySoft,
        treasurer: colors.warningSoft,
        guard: colors.successSoft,
        facility: colors.infoSoft,
    };
    const backgroundColor = cardColorMap[variant] || colors.primary;
    const accentColor = accentColorMap[variant] || colors.primaryPressed;
    return (<View style={[styles.card, createViewBackgroundColorStyle(backgroundColor), style]}>
      <View style={[styles.topSheen, createViewBackgroundColorStyle2(accentColor)]}/>
      <View style={[styles.bottomSheen, createViewBackgroundColorStyle3(accentColor)]}/>
      <View style={styles.content}>{children}</View>
    </View>);
}
export default GradientCard;

