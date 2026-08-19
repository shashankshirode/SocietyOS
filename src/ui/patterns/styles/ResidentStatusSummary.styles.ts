import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    list: {
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#198A59" | "#B97818" | "#5BD39A" | "#F0B85A") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#198A59" | "#B97818" | "#5BD39A" | "#F0B85A") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

