import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ row: { width: '100%', marginVertical: 3 }, own: { alignItems: 'flex-end' }, resident: { alignItems: 'flex-start' }, bubble: { maxWidth: '80%', borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 } });
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 4,
        alignSelf: 'flex-end'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

