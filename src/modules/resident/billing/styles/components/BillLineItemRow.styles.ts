import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: StyleSheet.hairlineWidth },
});
export function createSafeTextColorStyle(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#198A59" | "#5BD39A" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: "#253149" | "#E2E6EE") {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}

