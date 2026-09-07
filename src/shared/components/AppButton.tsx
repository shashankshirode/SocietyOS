import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { societyTouch } from "../theme/societyTheme";
import { useReducedMotion } from "../motion/useReducedMotion";
import { styles, createViewOpacityStyle } from "./styles/AppButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';
interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    compact?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    style?: ViewStyle;
    accessibilityLabel?: string;
    testID?: string;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function AppButton({ title, onPress, variant = 'primary', size = 'md', disabled = false, loading = false, fullWidth = false, compact = false, iconLeft, iconRight, style, accessibilityLabel, testID, }: AppButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { semantic, borderWidths, motion, colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    const resolvedSize = compact ? 'sm' : size;
    const isDisabled = disabled || loading;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    function handlePressIn() {
        if (!isDisabled && !reducedMotion) {
            scale.value = withSpring(motion.scale.press, motion.spring.press);
        }
    }
    function handlePressOut() {
        scale.value = reducedMotion ? 1 : withSpring(1, motion.spring.press);
    }
    const buttonBgStyles: Record<ButtonVariant, ViewStyle> = {
        primary: { backgroundColor: semantic.accent.moss },
        secondary: { backgroundColor: semantic.surface.focus },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: borderWidths.emphasis,
            borderColor: semantic.border.default,
        },
        ghost: { backgroundColor: 'transparent' },
        danger: { backgroundColor: semantic.status.danger },
        success: { backgroundColor: semantic.status.success },
        warning: { backgroundColor: semantic.status.warning },
    };
    const buttonTextStyles: Record<ButtonVariant, TextStyle> = {
        primary: { color: semantic.text.onPrimary },
        secondary: { color: semantic.text.primary },
        outline: { color: semantic.accent.moss },
        ghost: { color: semantic.text.primary },
        danger: { color: '#FFFDF8' },
        success: { color: '#FFFDF8' },
        warning: { color: '#111612' },
    };
    return (<AnimatedPressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isDisabled} style={[
            animatedStyle,
            styles.base,
            sizeStyles[resolvedSize],
            buttonBgStyles[variant],
            fullWidth && styles.fullWidth,
            isDisabled && styles.disabled,
            isDisabled && { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
            style,
        ]} accessibilityRole="button" accessibilityState={{ disabled: isDisabled, busy: loading }} accessibilityLabel={accessibilityLabel ?? `${title}${loading ? localizedUiText.m_d25310778d62 : ''}`} testID={testID}>
      <View style={styles.containerWrap}>
        {loading && (<View style={StyleSheet.absoluteFill}>
            <ActivityIndicator size="small" color={buttonTextStyles[variant].color}/>
          </View>)}
        <View style={[styles.contentRow, createViewOpacityStyle(loading ? 0 : 1)]}>
          {iconLeft && <View style={styles.iconContainer}>{iconLeft}</View>}
          <Text style={[styles.text, sizeTextStyles[resolvedSize], buttonTextStyles[variant], isDisabled && { color: colors.textDisabled }]}>
            {loading ? '' : title}
          </Text>
          {iconRight && <View style={styles.iconContainer}>{iconRight}</View>}
        </View>
      </View>
    </AnimatedPressable>);
}
const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
        minHeight: societyTouch.minimum,
        paddingHorizontal: Spacing.md,
    },
    md: {
        minHeight: societyTouch.comfortable,
        paddingHorizontal: Spacing.xl,
    },
    lg: {
        minHeight: societyTouch.command,
        paddingHorizontal: Spacing.xxl,
    },
};
const sizeTextStyles: Record<ButtonSize, TextStyle> = {
    sm: {
        fontSize: Typography.caption.fontSize,
    },
    md: {
        fontSize: Typography.button.fontSize,
    },
    lg: {
        fontSize: Typography.bodyLarge.fontSize,
    },
};
export default AppButton;
