import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    panel: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        gap: 4,
    },
    readOnlyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 4,
    },
    safeTextMarginBottom: { marginBottom: 8 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

