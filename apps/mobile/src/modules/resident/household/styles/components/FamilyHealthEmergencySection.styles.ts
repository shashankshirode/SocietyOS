import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 16
    },
    optionCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 6
    },
    optionDescription: {
        marginLeft: 28
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 4,
        fontWeight: '600'
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle2(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        opacity: 0.8
    } as const;
}
export function createViewBorderColorBackgroundColorStyle3(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        opacity: 0.8
    } as const;
}

