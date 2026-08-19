import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700',
        marginLeft: 4
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

