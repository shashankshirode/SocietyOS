import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        flex: 1,
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#F0FDF4" | "rgba(16,185,129,0.1)", borderColorValue: "rgba(16,185,129,0.2)" | "#D1FAE5") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

