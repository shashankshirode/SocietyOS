import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.pill,
        borderWidth: 1,
        gap: 6,
    },
    label: {
        ...Typography.caption,
        fontWeight: '600',
    },
    badge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

