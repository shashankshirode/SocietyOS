import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40, gap: 16 },
    banner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
    bannerText: { flex: 1, fontWeight: '600' },
    sectionTitle: { fontSize: 14, fontWeight: '700' },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeCard: { width: '30%', aspectRatio: 1, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, flexGrow: 1, minWidth: 90 },
    testButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
    testButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    resultSection: { gap: 12 },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
    resultTitle: { fontSize: 14 },
    warningCard: { padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
    resetButton: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    safeTextColorFontWeight: { color: '#F59E0B', fontWeight: '700' },
    safeTextColor: { color: '#F59E0B' },
    safeTextColorTextAlignFontWeight: { color: '#10B981', textAlign: 'center', fontWeight: '600' },
    viewBackgroundColorBorderColor: { backgroundColor: '#6366F1' + '10', borderColor: '#6366F1' + '30' },
    safeTextColor2: { color: '#6366F1' },
    viewBackgroundColorBorderColor2: { backgroundColor: '#10B981' + '10', borderColor: '#10B981' + '30' },
    safeTextColor3: { color: '#10B981' },
    viewBackgroundColorBorderColor3: { backgroundColor: '#F59E0B' + '10', borderColor: '#F59E0B' + '30' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600',
        textAlign: 'center'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        textAlign: 'center'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableOpacityStyle(opacityValue: 1 | 0.6) {
    return {
        backgroundColor: '#6366F1',
        opacity: opacityValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

