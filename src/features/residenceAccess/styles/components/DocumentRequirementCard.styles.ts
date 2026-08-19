import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    titleText: {
        flex: 1,
        gap: 3,
    },
    labels: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    reason: {
        borderRadius: Radius.sm,
        padding: Spacing.sm,
    },
    metadata: {
        gap: 3,
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

