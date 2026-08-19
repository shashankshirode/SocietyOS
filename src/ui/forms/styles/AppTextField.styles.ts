import { StyleSheet, type ViewStyle } from "react-native";
export const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        fontWeight: '600',
        padding: 0
    },
    multilineInput: {
        height: '100%',
        paddingTop: 10,
        paddingBottom: 10
    }
});
export function createViewHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderColorBackgroundColorSpread3Style(borderColorValue: string, backgroundColorValue: string, spread3Value: ViewStyle) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        ...spread3Value
    } as const;
}

