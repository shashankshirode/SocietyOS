import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 10 },
});
export function createSafeTextColorStyle(colorValue: string) {
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

