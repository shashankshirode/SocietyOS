import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
import { Shadows } from "../../theme/shadows";
export const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
        width: '100%',
        borderRadius: Radius.card,
        borderWidth: 1,
        padding: Spacing.lg,
        ...Shadows.soft,
    },
    title: {
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    content: {
        gap: Spacing.md,
    },
});
export function createViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
    } as const;
}

