import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40, gap: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    headerSection: { alignItems: 'center', gap: 6, paddingVertical: 8 },
    avatar: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: 18, fontWeight: '800' },
    badgeRow: { flexDirection: 'row', gap: 8 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    detailCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailLabel: { width: 70 },
    sectionTitle: { fontSize: 14, fontWeight: '700' },
    sosTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    sosChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    removeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
    safeTextColorFontSizeFontWeight: { color: '#3B82F6', fontSize: 24, fontWeight: '700' },
    safeTextColorFontWeight: { color: '#10B981', fontWeight: '600' },
    safeTextColorFontWeight2: { color: '#EF4444', fontWeight: '600' },
    viewBackgroundColor: { backgroundColor: '#3B82F6' + '18' },
    viewBackgroundColor2: { backgroundColor: '#10B981' + '18' },
    pressableBorderColor: { borderColor: '#EF4444' + '50' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        textAlign: 'center'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        flex: 1,
        textAlign: 'right'
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
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
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
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

