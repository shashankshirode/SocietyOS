import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderLeftWidth: 4,
        borderRadius: 12,
        padding: 12,
        gap: 12,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        flex: 1,
        gap: 2,
    },
    safeTextMarginBottom: { marginBottom: 4 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorBorderLeftColorStyle(backgroundColorValue: string, borderColorValue: string, borderLeftColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        borderLeftColor: borderLeftColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

