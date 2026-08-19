import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        marginBottom: 12
    },
    text: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '500'
    }
});
export function createAnimatedViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

