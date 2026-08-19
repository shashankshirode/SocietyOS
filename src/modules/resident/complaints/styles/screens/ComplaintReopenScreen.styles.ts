import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 20,
        paddingBottom: 120,
    },
    summaryCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
    },
    form: {
        gap: 16,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        backgroundColor: 'transparent',
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewPaddingBottomBorderTopColorStyle(paddingBottomValue: number, borderTopColorValue: "#253149" | "#E2E6EE") {
    return {
        paddingBottom: paddingBottomValue,
        borderTopColor: borderTopColorValue
    } as const;
}

