import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    tile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
        minHeight: 56,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontWeight: '700',
        flex: 1,
        fontSize: 12,
    },
});
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

