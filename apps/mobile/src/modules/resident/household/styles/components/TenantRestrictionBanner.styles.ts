import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        gap: 10,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

