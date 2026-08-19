import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    content: { padding: 16, gap: 10, paddingBottom: 40, flexGrow: 1 },
    card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 5 },
});
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
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

