import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeInDown } from "react-native-reanimated";
import { Spacing } from "../theme/spacing";
import { Shadows } from "../theme/shadows";
import { useAppTheme } from "../theme/useAppTheme";
import { styles } from "./styles/AppCard.styles";
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'muted' | 'warning' | 'danger' | 'success' | 'info';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
interface AppCardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    padding?: CardPadding;
    noPadding?: boolean;
    pressable?: boolean;
    selected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    animated?: boolean;
    animationDelay?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function AppCard({ children, variant = 'default', padding = 'md', noPadding = false, pressable = false, selected = false, disabled = false, onPress, animated = false, animationDelay = 0, style, testID, }: AppCardProps) {
    const { colors, dark } = useAppTheme();
    const finalPadding = noPadding ? 'none' : padding;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    function handlePressIn() {
        if (pressable && !disabled) {
            scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        }
    }
    function handlePressOut() {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
    const isInteractive = Boolean((pressable || onPress) && onPress && !disabled);
    const variantStyles: Record<CardVariant, ViewStyle> = {
        default: {
            borderColor: colors.border,
            backgroundColor: colors.surface,
        },
        elevated: {
            ...Shadows.card,
            shadowColor: colors.shadow,
            backgroundColor: colors.surface,
            ...(dark ? { borderWidth: 1, borderColor: colors.border } : {}),
        },
        outlined: {
            borderWidth: 1.5,
            borderColor: colors.border,
            backgroundColor: colors.surface,
        },
        muted: {
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.border,
        },
        warning: {
            backgroundColor: colors.warningSoft,
            borderColor: colors.warning,
            borderWidth: 1,
        },
        danger: {
            backgroundColor: colors.dangerSoft,
            borderColor: colors.danger,
            borderWidth: 1,
        },
        success: {
            backgroundColor: colors.successSoft,
            borderColor: colors.success,
            borderWidth: 1,
        },
        info: {
            backgroundColor: colors.infoSoft,
            borderColor: colors.info,
            borderWidth: 1,
        },
    };
    const cardStyle = [
        styles.base,
        variantStyles[variant],
        paddingStyles[finalPadding],
        selected && { borderColor: colors.primary, borderWidth: 2 },
        disabled && styles.disabled,
        style,
    ];
    if (isInteractive) {
        const pressableContent = (<AnimatedPressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[animatedStyle, cardStyle]} accessibilityRole="button" accessibilityState={{ disabled, selected }} testID={testID}>
        {children}
      </AnimatedPressable>);
        if (animated) {
            return (<Animated.View entering={FadeInDown.delay(animationDelay).duration(400).springify()}>
          {pressableContent}
        </Animated.View>);
        }
        return pressableContent;
    }
    const staticContent = <View testID={testID} style={cardStyle}>{children}</View>;
    if (animated) {
        return (<Animated.View entering={FadeInDown.delay(animationDelay).duration(400).springify()}>
        {staticContent}
      </Animated.View>);
    }
    return staticContent;
}
const paddingStyles: Record<CardPadding, ViewStyle> = {
    none: { padding: 0 },
    sm: { padding: Spacing.sm },
    md: { padding: Spacing.lg },
    lg: { padding: Spacing.xl },
};
export default AppCard;

