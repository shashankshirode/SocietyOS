import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme";
export const styles = StyleSheet.create({
    actions: {
        gap: Spacing.sm,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl
    },
    promptInput: {
        minHeight: 48,
        marginHorizontal: Spacing.xl,
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderRadius: 12
    }
});
export function createTextInputColorBackgroundColorBorderColorStyle(colorValue: string, backgroundColorValue: string, borderColorValue: string) {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

