import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    sheetHeader: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xs,
        paddingBottom: Spacing.md,
    },
    content: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
        gap: Spacing.lg,
    },
    contextCard: {
        padding: Spacing.md,
        borderRadius: Radius.sm,
        gap: 2,
    },
    result: {
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.lg,
    },
    appTextFontWeight: { fontWeight: '700' }
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        textAlign: 'center',
        color: colorValue
    } as const;
}
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

