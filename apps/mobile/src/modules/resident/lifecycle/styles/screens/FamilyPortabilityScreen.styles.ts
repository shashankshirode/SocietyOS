import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    option: { borderWidth: 1, borderRadius: 12, padding: Spacing.md, gap: 4 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
    consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
    checkbox: { width: 22, height: 22, borderWidth: 2, borderRadius: 5 },
    consentText: { flex: 1 },
});
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBorderColorStyle2(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

