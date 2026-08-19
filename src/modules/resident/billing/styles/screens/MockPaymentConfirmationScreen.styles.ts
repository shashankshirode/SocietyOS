import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingTop: 16 },
    contentStack: { gap: 20 },
    amountBox: { padding: 22, borderRadius: 18, borderWidth: 1, alignItems: 'center', gap: 7 },
    amount: { fontSize: 36, fontWeight: '800' },
    periodLabel: { fontWeight: '600' },
    methodSection: { gap: 12 },
    methodList: { gap: 10 },
    methodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
    methodIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    methodInfo: { flex: 1, gap: 3 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 10, height: 10, borderRadius: 5 },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#1E1B4B" | "#E8E5FB", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#4E46E5" | "#F4F6FB" | "#080D18" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

