import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },
    input: { borderWidth: 1, borderRadius: 12, minHeight: 48, paddingHorizontal: 14, paddingVertical: 12 },
    multiline: { minHeight: 130 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 22 },
    chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }
});
export function createSafeTextColorStyle(colorValue: "#D8464A" | "#FF8588") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#D8464A" | "#FF8588" | "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle2(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#D8464A" | "#FF8588" | "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

