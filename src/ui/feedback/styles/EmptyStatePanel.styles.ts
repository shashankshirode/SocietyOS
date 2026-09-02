import { StyleSheet } from "react-native";
import { Radius, Shadows, Spacing, Typography } from "../../../shared/theme";
import type { Absent } from "../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        borderRadius: Radius.surface,
        borderWidth: 1,
        width: '100%',
        marginVertical: Spacing.md,
        gap: Spacing.sm,
        ...Shadows.soft,
    },
    illustration: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xs,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: Radius.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    title: {
        ...Typography.title,
    },
    description: {
        ...Typography.bodyMedium,
        paddingHorizontal: Spacing.sm,
    },
    actions: {
        marginTop: Spacing.md,
        width: '100%',
        gap: Spacing.xs,
        alignItems: 'center',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorMaxWidthStyle(backgroundColorValue: string, borderColorValue: string, maxWidthValue: 520 | Absent) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        maxWidth: maxWidthValue
    } as const;
}
