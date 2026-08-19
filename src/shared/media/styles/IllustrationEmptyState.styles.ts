import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: { alignItems: 'center', borderRadius: Radius.card, borderWidth: 1, padding: Spacing.xxl },
    title: { fontSize: 17, fontWeight: '900', marginTop: Spacing.md, textAlign: 'center' },
    message: { fontSize: 13, lineHeight: 19, marginTop: Spacing.xs, textAlign: 'center' },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

