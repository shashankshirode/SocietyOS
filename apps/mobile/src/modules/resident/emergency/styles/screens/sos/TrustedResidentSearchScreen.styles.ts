import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40, gap: 12 },
    privacyNotice: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    searchInput: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    residentCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
    residentAvatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    residentContent: { flex: 1, gap: 2 },
    selectedCard: { padding: 14, borderRadius: 14, borderWidth: 1.5, gap: 4 },
    changeButton: { marginTop: 4 },
    sectionTitle: { fontSize: 14, fontWeight: '700' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    sendButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14 },
    sendText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    safeTextColorFontWeightFlex: { color: '#8B5CF6', fontWeight: '600', flex: 1 },
    safeTextColorFontWeight: { color: '#8B5CF6', fontWeight: '700' },
    safeTextColorFontWeight2: { color: '#8B5CF6', fontWeight: '600' },
    viewBackgroundColorBorderColor: { backgroundColor: '#8B5CF6' + '10', borderColor: '#8B5CF6' + '30' },
    viewBackgroundColor: { backgroundColor: '#8B5CF6' + '18' },
    viewBackgroundColorBorderColor2: { backgroundColor: '#8B5CF6' + '10', borderColor: '#8B5CF6' }
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
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle2(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createPressableOpacityStyle(opacityValue: 1 | 0.6) {
    return {
        backgroundColor: '#8B5CF6',
        opacity: opacityValue
    } as const;
}

