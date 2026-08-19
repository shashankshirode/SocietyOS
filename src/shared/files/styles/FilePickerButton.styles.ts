import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: Radius.md,
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    text: {
        ...Typography.bodySmall,
        fontWeight: '600',
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

