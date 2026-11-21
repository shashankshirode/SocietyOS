import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
    divider: { height: StyleSheet.hairlineWidth },
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

