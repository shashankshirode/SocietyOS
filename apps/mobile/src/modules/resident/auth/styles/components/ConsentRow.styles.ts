import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: Radius.card,
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    boldText: {
        fontWeight: '600',
    },
    requiredBadge: {
        borderWidth: 1,
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 1,
        fontSize: 10,
        fontWeight: '700',
    },
    checkboxWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorBorderColorStyle(colorValue: string, borderColorValue: string) {
    return {
        color: colorValue,
        borderColor: borderColorValue
    } as const;
}

