import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40, gap: 16 },
    field: { gap: 6 },
    label: { fontSize: 12, fontWeight: '600' },
    input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
    multilineInput: { minHeight: 80, textAlignVertical: 'top' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    saveButton: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
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
export function createTextInputBackgroundColorBorderColorColorStyle(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle2(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle3(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
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
export function createSafeTextColorStyle8(colorValue: string) {
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
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle3(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle10(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputBackgroundColorBorderColorColorStyle4(backgroundColorValue: string, borderColorValue: string, colorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        color: colorValue
    } as const;
}
export function createPressableOpacityStyle(opacityValue: 1 | 0.6) {
    return {
        backgroundColor: '#3B82F6',
        opacity: opacityValue
    } as const;
}

