import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 7 },
    value: { fontSize: 14, fontWeight: '900' },
    label: { fontSize: 9, fontWeight: '700', maxWidth: 50 },
});
export function createViewWidthHeightBorderRadiusBorderColorBorderTopColorBorderRightCStyle(widthValue: number, heightValue: number, borderRadiusValue: number, borderColorValue: string, borderTopColorValue: string, borderRightColorValue: string, borderBottomColorValue: string, borderLeftColorValue: string) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue,
        borderColor: borderColorValue,
        borderTopColor: borderTopColorValue,
        borderRightColor: borderRightColorValue,
        borderBottomColor: borderBottomColorValue,
        borderLeftColor: borderLeftColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

