import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, gap: 20, paddingBottom: 40 },
    card: { padding: 16, borderWidth: 1, borderRadius: 16, gap: 6 },
    notice: { flexDirection: 'row', padding: 16, borderWidth: 1, borderRadius: 14, gap: 10 },
    section: { gap: 10 },
    option: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 14, gap: 12 },
    flexText: { flex: 1 },
    modeRow: { flexDirection: 'row', gap: 10 },
    modeButton: { flex: 1 }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
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
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#F9FAFD" | "#172033", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: "#FFFFFF" | "#111827" | "#1E1B4B" | "#E8E5FB", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

