import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },
    notice: { flexDirection: 'row', borderWidth: 1, borderRadius: 14, padding: 14, gap: 10, marginBottom: 20 },
    flexText: { flex: 1 },
    input: { borderWidth: 1, borderRadius: 12, minHeight: 48, paddingHorizontal: 14, paddingVertical: 12 },
    scopeList: { gap: 8, marginTop: 10, marginBottom: 22 },
    scopeOption: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, padding: 13 },
    consent: { flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 22 }
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
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#F9FAFD" | "#172033", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle2(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle3(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827" | "#1E1B4B" | "#E8E5FB", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

