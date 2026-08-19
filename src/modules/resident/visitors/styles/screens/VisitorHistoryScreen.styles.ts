import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    filterBar: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
});
export function createSafeTextColorStyle(colorValue: "#FFFFFF" | "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

