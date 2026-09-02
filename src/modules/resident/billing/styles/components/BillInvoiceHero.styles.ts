import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 20 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    titleBlock: { flex: 1, minWidth: 0, gap: 4 },
    amountBlock: { gap: 4 },
    amount: { fontSize: 36, lineHeight: 42, fontWeight: '800' },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

