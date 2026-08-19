import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
    divider: { height: StyleSheet.hairlineWidth },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC" | "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

