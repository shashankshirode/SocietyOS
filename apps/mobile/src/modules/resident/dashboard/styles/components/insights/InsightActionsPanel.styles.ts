import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
    },
    btn: {
        minHeight: 44,
        minWidth: 100,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignSelf: 'flex-start'
    },
    btnText: {
        fontSize: 14,
        fontWeight: '700'
    }
});
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableScaleBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderWidth: 1,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

