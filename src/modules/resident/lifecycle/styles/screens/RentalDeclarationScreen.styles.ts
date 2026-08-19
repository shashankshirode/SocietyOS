import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }
});
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

