import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    content: {
        gap: Spacing.lg,
        paddingTop: 0
    },
    progressCard: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.md
    },
    section: {
        gap: Spacing.md
    }
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

