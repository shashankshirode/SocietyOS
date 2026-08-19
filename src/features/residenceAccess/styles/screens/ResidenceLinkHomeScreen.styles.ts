import { StyleSheet } from "react-native";
import { Radius } from "../../../../shared/theme/radius";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    content: { gap: Spacing.lg, paddingTop: 0 },
    form: { gap: Spacing.sm },
    optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    option: { minHeight: 44, borderWidth: 1, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, justifyContent: 'center' }
});
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorStyle2(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

