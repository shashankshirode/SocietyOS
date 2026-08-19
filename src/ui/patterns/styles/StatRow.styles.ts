import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    title: {
        marginBottom: 12,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
    },
    statCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
        gap: 2,
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        marginTop: 2
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewBorderRightColorStyle(borderRightColorValue: string) {
    return {
        borderRightWidth: 1,
        borderRightColor: borderRightColorValue
    } as const;
}

