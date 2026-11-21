import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ root: { flex: 1 }, channels: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 }, chip: { minHeight: 36, borderWidth: 1, borderRadius: 18, justifyContent: 'center', paddingHorizontal: 14 }, notice: { paddingHorizontal: 12, paddingVertical: 7 } });
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
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

