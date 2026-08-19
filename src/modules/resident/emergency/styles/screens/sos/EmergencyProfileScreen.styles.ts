import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40, gap: 12 },
    notice: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'flex-start' },
    noticeContent: { flex: 1, gap: 2 },
    sectionTitle: { fontSize: 14, fontWeight: '700', marginTop: 8 },
    field: { gap: 4 },
    label: { fontSize: 12, fontWeight: '600' },
    input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    multiline: { minHeight: 80, textAlignVertical: 'top' },
    saveButton: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
    saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    safeTextColorFontWeight: { color: '#F59E0B', fontWeight: '600' },
    safeTextColor: { color: '#F59E0B' },
    viewBackgroundColorBorderColor: { backgroundColor: '#F59E0B' + '10', borderColor: '#F59E0B' + '30' },
    pressableBackgroundColor: { backgroundColor: '#3B82F6' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        lineHeight: 20
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
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

