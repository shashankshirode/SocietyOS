import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    textWrap: {
        flex: 1,
        gap: 2,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    btn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSecondary: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    safeTextColorFontWeight: { color: '#FFFFFF', fontWeight: '700' }
});
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

