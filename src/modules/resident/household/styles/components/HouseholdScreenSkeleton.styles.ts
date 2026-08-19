import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    bar: {
        height: 12,
        borderRadius: 999,
    },
    row: {
        height: 42,
        borderRadius: 12,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        width: '60%'
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        width: '40%'
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        width: '80%'
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        width: '70%'
    } as const;
}

