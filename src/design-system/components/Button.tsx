import React, { forwardRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { HapticFeedback } from '../../shared/utils/haptics';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { colors, getColors } from '../tokens/premium-colors';
import { typography } from '../tokens/premium-typography';
import { spacing } from '../tokens/premium-spacing';
import { radius } from '../tokens/premium-radius';
import { shadows } from '../tokens/premium-shadows';
import { motion } from '../tokens/premium-motion';
import type { Absent } from "../../shared/types/absence.types";
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'glassDark';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress' | 'style'> {
    title: string;
    variant?: ButtonVariant | Absent;
    size?: ButtonSize | Absent;
    loading?: boolean | Absent;
    leftIcon?: React.ReactNode | Absent;
    rightIcon?: React.ReactNode | Absent;
    fullWidth?: boolean | Absent;
    onPress?: (() => void) | Absent;
    testID?: string | Absent;
    accessibilityLabel?: string | Absent;
    disabled?: boolean | Absent;
    style?: StyleProp<ViewStyle> | Absent;
}
const sizeConfig = {
    xs: { height: 32, paddingHorizontal: 12, fontSize: typography.fontSize.xs, iconSize: 14, gap: 4, borderRadius: radius.sm },
    sm: { height: 40, paddingHorizontal: 16, fontSize: typography.fontSize.sm, iconSize: 16, gap: 6, borderRadius: radius.md },
    md: { height: 48, paddingHorizontal: 20, fontSize: typography.fontSize.base, iconSize: 18, gap: 8, borderRadius: radius.md },
    lg: { height: 56, paddingHorizontal: 24, fontSize: typography.fontSize.lg, iconSize: 20, gap: 10, borderRadius: radius.lg },
    xl: { height: 64, paddingHorizontal: 28, fontSize: typography.fontSize.xl, iconSize: 22, gap: 12, borderRadius: radius.lg },
};
export const Button = forwardRef<View, ButtonProps>(({ title, variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, fullWidth = false, onPress, style, testID, accessibilityLabel, disabled, ...props }, ref) => {
    const { dark } = useAppTheme();
    const tc = getColors(dark ? 'dark' : 'light');
    const cfg = sizeConfig[size];
    const isDisabled = disabled || loading;
    const variantStyles: Record<ButtonVariant, {
        backgroundColor: string;
        borderColor: string;
        textColor: string;
        borderWidth?: number;
    }> = {
        primary: {
            backgroundColor: tc.brand.primary,
            borderColor: tc.brand.primary,
            textColor: tc.text.inverse,
            borderWidth: 0,
        },
        secondary: {
            backgroundColor: tc.brand.secondary,
            borderColor: tc.brand.secondary,
            textColor: tc.text.inverse,
            borderWidth: 0,
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: tc.brand.primary,
            textColor: tc.brand.primary,
            borderWidth: 2,
        },
        ghost: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: tc.brand.primary,
            borderWidth: 0,
        },
        danger: {
            backgroundColor: tc.brand.danger,
            borderColor: tc.brand.danger,
            textColor: tc.text.inverse,
            borderWidth: 0,
        },
        glass: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            textColor: tc.text.inverse,
            borderWidth: 1,
        },
        glassDark: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textColor: tc.text.inverse,
            borderWidth: 1,
        },
    };
    const v = variantStyles[variant];
    const baseStyle: ViewStyle = {
        height: cfg.height,
        paddingHorizontal: cfg.paddingHorizontal,
        borderRadius: cfg.borderRadius,
        borderWidth: v.borderWidth || 0,
        backgroundColor: isDisabled ? tc.text.quaternary : v.backgroundColor,
        borderColor: isDisabled ? tc.border.subtle : v.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: cfg.gap,
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.6 : 1,
    };
    const textStyle: TextStyle = {
        fontSize: cfg.fontSize,
        fontWeight: typography.fontWeight.semibold,
        color: isDisabled ? tc.text.quaternary : v.textColor,
        lineHeight: cfg.fontSize * 1.2,
    };
    const handlePress = () => {
        if (!isDisabled && onPress) {
            HapticFeedback.light();
            onPress();
        }
    };
    return (<TouchableOpacity ref={ref as any} onPress={handlePress} disabled={isDisabled} activeOpacity={0.85} style={[baseStyle, style]} testID={testID} accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled: isDisabled }} {...props}>
        {loading ? (<ActivityIndicator size="small" color={textStyle.color}/>) : (<>
            {leftIcon && <View>{leftIcon}</View>}
            <Text style={textStyle}>{title}</Text>
            {rightIcon && <View>{rightIcon}</View>}
          </>)}
      </TouchableOpacity>);
});
Button.displayName = 'Button';
const styles = StyleSheet.create({});
export default Button;

