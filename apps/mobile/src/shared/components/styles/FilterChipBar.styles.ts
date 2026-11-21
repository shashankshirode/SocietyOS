import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    chip: { borderRadius: Radius.pill, borderWidth: 1, minHeight: 38, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, maxWidth: '100%' },
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

