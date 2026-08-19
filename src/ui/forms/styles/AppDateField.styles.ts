import { StyleSheet, type ViewStyle } from "react-native";
export const styles = StyleSheet.create({
    wrapper: {
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
    },
    sheetContent: {
        paddingHorizontal: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        gap: 12,
        height: 180,
        marginBottom: 4
    },
    column: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden'
    },
    columnLarge: {
        flex: 1.5,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden'
    },
    columnLabel: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        fontWeight: '700'
    },
    scroll: {
        flex: 1
    },
    item: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "500" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextBorderBottomColorBackgroundColorStyle(borderBottomColorValue: string, backgroundColorValue: string) {
    return {
        borderBottomColor: borderBottomColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
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

