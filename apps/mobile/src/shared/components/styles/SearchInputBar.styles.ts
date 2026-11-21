import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: { minHeight: 48, borderRadius: Radius.pill, borderWidth: 1, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    input: { flex: 1, minWidth: 0, ...Typography.body },
});
export function createViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

