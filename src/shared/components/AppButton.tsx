import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing } from "../theme/spacing";
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
    const { colors } = useAppTheme();
    const resolvedSize = compact ? 'sm' : size;
    const isDisabled = disabled || loading;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    function handlePressIn() {
        if (!isDisabled) {
            scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
        }
    }
    function handlePressOut() {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
    const buttonBgStyles: Record<ButtonVariant, ViewStyle> = {
        primary: { backgroundColor: colors.primary },
        secondary: { backgroundColor: colors.primarySoft },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.border,
        },
        ghost: { backgroundColor: 'transparent' },
        danger: { backgroundColor: colors.danger },
        success: { backgroundColor: colors.success },
        warning: { backgroundColor: colors.warning },
    };
    const buttonTextStyles: Record<ButtonVariant, TextStyle> = {
        primary: { color: colors.primaryText },
        secondary: { color: colors.primary },
        outline: { color: colors.textSecondary },
        ghost: { color: colors.primary },
        danger: { color: colors.textInverse },
        success: { color: colors.textInverse },
        warning: { color: colors.textInverse },
    };
    return (<AnimatedPressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isDisabled} style={[
            animatedStyle,
            styles.base,
            sizeStyles[resolvedSize],
            buttonBgStyles[variant],
            fullWidth && styles.fullWidth,
            isDisabled && styles.disabled,
            style,
        ]} accessibilityRole="button" accessibilityState={{ disabled: isDisabled, busy: loading }} accessibilityLabel={accessibilityLabel ?? `${title}${loading ? localizedUiText.m_d25310778d62 : ''}`} testID={testID}>
      <View style={styles.containerWrap}>
        {loading && (<View style={StyleSheet.absoluteFillObject}>
            <ActivityIndicator size="small" color={buttonTextStyles[variant].color}/>
          </View>)}
        <View style={[styles.contentRow, createViewOpacityStyle(loading ? 0 : 1)]}>
          {iconLeft && <View style={styles.iconContainer}>{iconLeft}</View>}
          <Text style={[styles.text, sizeTextStyles[resolvedSize], buttonTextStyles[variant]]}>
            {loading ? '' : title}
          </Text>
          {iconRight && <View style={styles.iconContainer}>{iconRight}</View>}
        </View>
      </View>
    </AnimatedPressable>);
}
const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
        minHeight: 38,
        paddingHorizontal: Spacing.md,
    },
    md: {
        minHeight: 48,
        paddingHorizontal: Spacing.xl,
    },
    lg: {
        minHeight: 56,
        paddingHorizontal: Spacing.xxl,
    },
};
const sizeTextStyles: Record<ButtonSize, TextStyle> = {
    sm: {
        fontSize: 13,
    },
    md: {
        fontSize: 14,
    },
    lg: {
        fontSize: 16,
    },
};
export default AppButton;

