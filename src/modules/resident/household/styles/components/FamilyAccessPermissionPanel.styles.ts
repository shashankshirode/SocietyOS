import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    panel: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        gap: 4
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        marginTop: -4,
        marginBottom: 8,
        fontWeight: '600'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

