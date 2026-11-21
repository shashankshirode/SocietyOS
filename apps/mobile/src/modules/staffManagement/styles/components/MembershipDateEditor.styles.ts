import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ root: { gap: 7 }, field: { gap: 3 }, input: { minHeight: 38, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 }, button: { alignSelf: 'flex-start', minHeight: 32, borderWidth: 1, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 12 } });
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
export function createTextInputBorderColorColorStyle(borderColorValue: string, colorValue: string) {
    return {
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createTextInputBorderColorColorStyle2(borderColorValue: string, colorValue: string) {
    return {
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

