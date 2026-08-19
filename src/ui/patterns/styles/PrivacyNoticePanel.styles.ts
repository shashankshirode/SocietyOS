import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 16,
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    points: {
        gap: 6,
        marginTop: 4,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bullet: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
});
export function createSafeTextColorStyle(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        lineHeight: 16
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

