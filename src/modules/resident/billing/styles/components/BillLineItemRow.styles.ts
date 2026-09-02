import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: StyleSheet.hairlineWidth },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}

