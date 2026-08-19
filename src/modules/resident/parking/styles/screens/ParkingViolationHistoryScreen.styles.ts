import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 20, gap: 12, paddingBottom: 40, flexGrow: 1 },
    card: { padding: 16, borderWidth: 1, borderRadius: 16, gap: 10 },
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    heading: { flex: 1, gap: 3 },
    divider: { height: 1 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#B97818" | "#F0B85A") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#D8464A" | "#FF8588") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F9FAFD" | "#172033" | "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

