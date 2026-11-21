import { StyleSheet, type ViewStyle } from "react-native";
export const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 0,
        fontSize: 14,
        fontWeight: '600',
        textAlignVertical: 'center',
    },
});
export function createTextInputBackgroundColorBorderColorColorShadowColorSpread5Style(backgroundColorValue: string, borderColorValue: string, colorValue: string, shadowColorValue: string, spread5Value: ViewStyle) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue,
        shadowColor: shadowColorValue,
        ...spread5Value
    } as const;
}

