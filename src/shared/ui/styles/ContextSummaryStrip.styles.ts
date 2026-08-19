import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    strip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        flexWrap: 'wrap',
        gap: 8,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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

