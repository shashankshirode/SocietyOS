import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import type { Absent } from "../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        borderRadius: 20,
        borderWidth: 1,
        width: '100%',
        marginVertical: Spacing.md,
        gap: Spacing.sm,
        shadowColor: '#000000',
        shadowOpacity: 0.02,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },
    illustration: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xs,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: Spacing.sm,
    },
    actions: {
        marginTop: Spacing.md,
        width: '100%',
        gap: Spacing.xs,
        alignItems: 'center',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: "rgba(255, 255, 255, 0.05)" | "rgba(15, 23, 42, 0.03)") {
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

