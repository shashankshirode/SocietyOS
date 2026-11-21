import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.md, gap: Spacing.md },
    box: { padding: Spacing.md, borderRadius: 8, borderWidth: 1 },
    label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    val: { fontSize: 16, marginTop: 2, fontWeight: 'bold' },
    actions: { marginTop: Spacing.md },
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
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        marginTop: Spacing.sm
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        marginTop: Spacing.sm
    } as const;
}
export function createTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        marginTop: Spacing.sm
    } as const;
}
export function createTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

