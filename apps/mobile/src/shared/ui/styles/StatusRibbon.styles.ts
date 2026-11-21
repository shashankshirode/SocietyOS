import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    ribbon: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

