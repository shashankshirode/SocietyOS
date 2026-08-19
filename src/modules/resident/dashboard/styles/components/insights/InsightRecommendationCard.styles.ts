import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        gap: 6
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    title: {
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 10
    },
    text: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600'
    }
});
export function createAnimatedViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

