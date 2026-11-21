import { StyleSheet, type ViewStyle } from "react-native";
export const styles = StyleSheet.create({
    selectWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16
    },
    valueText: {
        fontSize: 14,
        fontWeight: '600'
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorSpread3Style(borderColorValue: string, backgroundColorValue: string, spread3Value: ViewStyle) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        ...spread3Value
    } as const;
}

