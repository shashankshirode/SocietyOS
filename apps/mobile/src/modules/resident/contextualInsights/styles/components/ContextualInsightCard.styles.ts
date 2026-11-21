import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        flex: 1,
        marginLeft: 8
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

