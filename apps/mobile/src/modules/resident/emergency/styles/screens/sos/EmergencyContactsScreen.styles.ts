import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { padding: 16, paddingBottom: 40, gap: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
    addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    emptyCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center', gap: 8 },
    emptyTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
    emptyMessage: { textAlign: 'center', lineHeight: 20 },
    emptyRecommendation: { textAlign: 'center', lineHeight: 16, fontWeight: '600' },
    section: { gap: 8 },
    sectionTitle: { fontSize: 13, fontWeight: '700' },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
    contactAvatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    contactInitials: { fontSize: 14, fontWeight: '700' },
    contactContent: { flex: 1, gap: 2 },
    contactName: { fontSize: 14, fontWeight: '600' },
    contactBadges: { flexDirection: 'row', gap: 6, marginRight: 8, alignItems: 'center' },
    inactiveBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    pendingBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    safeTextColorFontWeight: { color: '#6B7280', fontWeight: '600' },
    safeTextColorFontWeight2: { color: '#F59E0B', fontWeight: '600' },
    viewBackgroundColor: { backgroundColor: '#6B7280' + '18' },
    viewBackgroundColor2: { backgroundColor: '#F59E0B' + '18' },
    pressableBackgroundColor: { backgroundColor: '#3B82F6' },
    safeTextColor: { color: '#F59E0B' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorOpacityStyle(backgroundColorValue: string, borderColorValue: string, opacityValue: 1 | 0.5) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        opacity: opacityValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

