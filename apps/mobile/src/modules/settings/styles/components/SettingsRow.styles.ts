import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColumn: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    description: {
        marginTop: 2,
        fontSize: 12,
    },
    trailingContainer: {
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    chevronContainer: {
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderBottomColorBorderBottomWidthBackgroundColorOpacitStyle(borderBottomColorValue: string, borderBottomWidthValue: number, backgroundColorValue: string, opacityValue: 1 | 0.5 | 0.7) {
    return {
        borderBottomColor: borderBottomColorValue,
        borderBottomWidth: borderBottomWidthValue,
        backgroundColor: backgroundColorValue,
        opacity: opacityValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

