import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
export const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.pill,
        borderWidth: 1,
        gap: 6,
        maxWidth: 220,
        flexShrink: 1,
    },
    chipText: {
        fontWeight: '600',
        flexShrink: 1,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: Radius.pill,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    clearBtn: {
        marginLeft: 2,
    },
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

