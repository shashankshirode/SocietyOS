import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    pillSmall: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    text: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    textSmall: {
        fontSize: 10,
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

