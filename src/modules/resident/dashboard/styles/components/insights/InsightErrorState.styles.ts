import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    desc: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    btn: {
        minHeight: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontSize: 13
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
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

