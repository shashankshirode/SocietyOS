import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { minWidth: 0, borderLeftWidth: 3, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
    content: { flex: 1, minWidth: 0 },
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
export function createViewBorderLeftColorBackgroundColorStyle(borderLeftColorValue: string, backgroundColorValue: string) {
    return {
        borderLeftColor: borderLeftColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

