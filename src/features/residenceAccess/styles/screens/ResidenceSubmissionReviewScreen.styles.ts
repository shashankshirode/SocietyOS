import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    content: {
        gap: Spacing.lg,
        paddingTop: 0,
    },
    card: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.xs,
    },
    section: {
        gap: Spacing.md,
    },
    documentRow: {
        borderBottomWidth: 1,
        paddingBottom: Spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    documentText: {
        flex: 1,
        gap: 2,
    },
    declaration: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    declarationText: {
        flex: 1,
    },
});
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

