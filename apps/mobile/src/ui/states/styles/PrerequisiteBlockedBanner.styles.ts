import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    banner: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        gap: 10,
    },
    text: {
        flex: 1,
        gap: 3,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

