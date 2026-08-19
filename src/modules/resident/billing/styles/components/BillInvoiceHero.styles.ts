import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 20 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    titleBlock: { flex: 1, minWidth: 0, gap: 4 },
    amountBlock: { gap: 4 },
    amount: { fontSize: 36, lineHeight: 42, fontWeight: '800' },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#F9FAFD" | "#172033", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}

