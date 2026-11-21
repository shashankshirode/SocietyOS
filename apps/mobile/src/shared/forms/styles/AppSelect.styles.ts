import { StyleSheet, type ViewStyle } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        ...Typography.label,
        marginBottom: Spacing.sm,
    },
    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    option: {
        minHeight: 40,
        borderRadius: Radius.pill,
        borderWidth: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
    },
    optionText: {
        ...Typography.bodySmall,
        fontWeight: '800',
    },
    error: {
        ...Typography.formError,
        marginTop: Spacing.xs,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityShadowColorSpread5Style(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.5, shadowColorValue: string, spread5Value: ViewStyle) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue,
        shadowColor: shadowColorValue,
        ...spread5Value
    } as const;
}

