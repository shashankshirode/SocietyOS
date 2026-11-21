import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    safe: { borderTopWidth: 1 },
    content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: Spacing.sm },
});
export function createSafeAreaViewBackgroundColorBorderTopColorStyle(backgroundColorValue: string, borderTopColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue
    } as const;
}

