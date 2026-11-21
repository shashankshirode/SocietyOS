import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    content: {
        flex: 1,
        gap: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

