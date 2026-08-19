import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.caption,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    content: {
        marginHorizontal: Spacing.lg,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

