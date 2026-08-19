import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    listFrame: { flex: 1, paddingHorizontal: 0 },
    listContent: { paddingTop: 16, gap: 10 },
    headerStack: { gap: 18, marginBottom: 16 },
    phoneItem: { width: '100%', marginBottom: 10 },
    tabletItem: { width: '49%', marginBottom: 10 },
    tabletRow: { justifyContent: 'space-between', gap: 12 },
    footer: { minHeight: 44, justifyContent: 'center', paddingVertical: 8 },
    loadingMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
    skeletonFrame: { paddingVertical: 16 },
    emptyState: { minHeight: 260, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
    clearFilter: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderRadius: 12, marginTop: 4 },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
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
export function createViewBackgroundColorStyle4(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createFlatListPaddingBottomPaddingHorizontalStyle(paddingBottomValue: number, paddingHorizontalValue: number) {
    return {
        paddingBottom: paddingBottomValue,
        paddingHorizontal: paddingHorizontalValue
    } as const;
}

