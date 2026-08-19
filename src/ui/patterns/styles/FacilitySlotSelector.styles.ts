import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 8,
    },
    slot: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minWidth: 80,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginBottom: 8
    } as const;
}
export function createPressableScaleOpacityStyle(opacityValue: 1 | 0.5) {
    return {
        opacity: opacityValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#B97818" | "#F0B85A") {
    return {
        color: colorValue,
        fontSize: 9,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#D8464A" | "#FF8588") {
    return {
        color: colorValue,
        fontSize: 9,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

