import React, { forwardRef } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { glassStyles, colors, getColors } from '../tokens/premium-colors';
import { radius } from '../tokens/premium-radius';
import { shadows } from '../tokens/premium-shadows';
import { motion } from '../tokens/premium-motion';
import { spacing } from '../tokens/premium-spacing';
import type { Absent } from "../../shared/types/absence.types";
export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass' | 'glassDark' | 'glassLight';
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant | Absent;
    padding?: CardPadding | Absent;
    onPress?: (() => void) | Absent;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
const paddingMap: Record<CardPadding, number> = {
    none: 0,
    xs: spacing[2],
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[5],
    xl: spacing[6],
};
const glassMap = {
    glass: 'regular',
    glassDark: 'strong',
    glassLight: 'subtle',
} as const;
export const Card = forwardRef<View, CardProps>(({ children, variant = 'elevated', padding = 'md', onPress, style, testID }, ref) => {
    const { dark } = useAppTheme();
    const tc = getColors(dark ? 'dark' : 'light');
    const mode = dark ? 'dark' : 'light';
    const pad = paddingMap[padding];
    const isGlass = variant.startsWith('glass');
    const glassKey = isGlass ? (glassMap[variant as keyof typeof glassMap] ?? 'regular') : null;
    const glassStyle = glassKey ? glassStyles[mode][glassKey] : null;
    const baseStyles: ViewStyle = StyleSheet.flatten([
        styles.base,
        !isGlass && styles[variant as 'elevated' | 'outlined' | 'filled'],
        !isGlass && variant === 'elevated' && { backgroundColor: tc.surface.elevated },
        !isGlass && variant === 'filled' && { backgroundColor: tc.surface.secondary },
        !isGlass && variant === 'outlined' && { backgroundColor: tc.surface.primary, borderColor: tc.border.default },
        isGlass && glassStyle,
        pad > 0 && { padding: pad },
        style,
    ]);
    if (onPress) {
        return (<TouchableOpacity ref={ref as any} onPress={onPress} activeOpacity={0.85} style={baseStyles} testID={testID}>
          {children}
        </TouchableOpacity>);
    }
    return <View ref={ref} style={baseStyles} testID={testID}>{children}</View>;
});
Card.displayName = 'Card';
const styles = StyleSheet.create({
    base: {
        borderRadius: radius.lg,
    },
    elevated: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    outlined: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filled: {
        backgroundColor: '#F8FAFC',
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    glassDark: {
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
    },
    glassLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});
export interface CardSectionProps {
    children: React.ReactNode;
    style?: ViewStyle;
}
export const CardHeader = ({ children, style }: CardSectionProps) => (<View style={[{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[2] }, style]}>
    {children}
  </View>);
export const CardContent = ({ children, style }: CardSectionProps) => (<View style={[{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }, style]}>
    {children}
  </View>);
export const CardFooter = ({ children, style }: CardSectionProps) => (<View style={[{ paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[4] }, style]}>
    {children}
  </View>);
export default Card;

