import { StyleSheet } from "react-native";
import { Radius } from "../../../../shared/theme/radius";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    content: { gap: Spacing.lg, paddingTop: 0 },
    form: { gap: Spacing.md },
    options: { gap: Spacing.sm },
    option: { minHeight: 48, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, justifyContent: 'center' },
    actions: { gap: Spacing.sm },
    section: { gap: Spacing.md }
});
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

