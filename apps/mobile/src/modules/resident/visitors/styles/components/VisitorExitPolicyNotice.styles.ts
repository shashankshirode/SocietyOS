import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        gap: 10,
    },
    text: {
        flex: 1,
        gap: 4,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

