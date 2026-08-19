import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    listFrame: { flex: 1, paddingHorizontal: 0 },
    content: { paddingTop: 16, gap: 10 },
    headerStack: { gap: 18, marginBottom: 4 },
    balanceCard: { padding: 20, borderRadius: 18, borderWidth: 1, alignItems: 'center', gap: 5 },
    entryCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 15, borderWidth: 1, gap: 12 },
    entryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    entryInfo: { flex: 1, minWidth: 0, gap: 2 },
    loader: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    empty: { minHeight: 250, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
    safeTextFontWeight: { fontWeight: '600' }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#198A59" | "#D8464A" | "#5BD39A" | "#FF8588") {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#198A59" | "#D8464A" | "#5BD39A" | "#FF8588") {
    return {
        color: colorValue,
        fontSize: 32,
        fontWeight: '800'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: "#CBD5E1" | "#475467") {
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
export function createViewBackgroundColorStyle(backgroundColorValue: "#1E1B4B" | "#052E16" | "#E8E5FB" | "#DCFCE7") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createFlatListPaddingBottomPaddingHorizontalStyle(paddingBottomValue: number, paddingHorizontalValue: number) {
    return {
        paddingBottom: paddingBottomValue,
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

