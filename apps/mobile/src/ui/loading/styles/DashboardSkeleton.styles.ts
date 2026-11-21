import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    identityHeader: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 18,
        gap: 16,
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    headerCopy: { flex: 1, gap: 8 },
    headerActions: { flexDirection: 'row', gap: 10 },
    frame: { paddingTop: 24, paddingBottom: 120 },
    phone: { gap: 28 },
    twoPane: { flexDirection: 'row', alignItems: 'flex-start' },
    left: { flex: 7, minWidth: 0 },
    right: { flex: 5, minWidth: 0 },
    column: {},
    sectionCard: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        gap: 14,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionHeaderCopy: { flex: 1, gap: 7 },
    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    rowCopy: { flex: 1, gap: 7 },
    pulseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewGapStyle2(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewGapStyle3(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}

