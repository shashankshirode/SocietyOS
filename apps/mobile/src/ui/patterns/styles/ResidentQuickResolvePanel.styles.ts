import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    text: {
        flex: 1,
        gap: 2,
    },
    btn: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeTextColorFontWeight: { color: '#FFFFFF', fontWeight: '700' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

