import { StyleSheet, type ViewStyle } from 'react-native';
export const APP_TEXT_AREA_MINIMUM_HEIGHT = 120;
export const APP_TEXT_AREA_MAXIMUM_HEIGHT = 184;
export const styles = StyleSheet.create({
    input: {
        width: '100%',
        minHeight: APP_TEXT_AREA_MINIMUM_HEIGHT,
        maxHeight: APP_TEXT_AREA_MAXIMUM_HEIGHT,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 14,
        fontWeight: '600',
    },
});
export function createTextInputHeightBackgroundColorBorderColorColorShadowColorSpread6Style(heightValue: number, backgroundColorValue: string, borderColorValue: string, colorValue: string, shadowColorValue: string, spread6Value: ViewStyle) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue,
        shadowColor: shadowColorValue,
        ...spread6Value
    } as const;
}

