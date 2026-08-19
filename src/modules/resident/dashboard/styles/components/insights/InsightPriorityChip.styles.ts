import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 999,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0,
        fontSize: 9,
    },
});
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

