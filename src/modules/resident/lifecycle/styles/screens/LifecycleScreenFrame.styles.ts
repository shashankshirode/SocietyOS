import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingVertical: Spacing.lg, paddingBottom: 120 },
    content: { gap: Spacing.md },
    card: { borderWidth: 1, borderRadius: 16, padding: Spacing.lg, gap: Spacing.sm },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

