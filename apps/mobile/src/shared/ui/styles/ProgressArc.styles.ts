import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    valText: {
        fontWeight: '800',
    },
    label: {
        marginTop: 8,
        fontWeight: '600',
    },
});
export function createViewWidthHeightBorderRadiusBorderColorBackgroundColorStyle(widthValue: number, heightValue: number, borderRadiusValue: number, borderColorValue: string, backgroundColorValue: string) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue,
        borderColor: borderColorValue,
        borderWidth: 8,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

