import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({ root: { flex: 1 }, notice: { padding: 7 }, list: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'flex-end', padding: 12 }, composer: { borderTopWidth: 1, flexDirection: 'row', gap: 8, padding: 10 }, input: { flex: 1, minHeight: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 14 }, send: { minWidth: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 } });
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
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderTopColorStyle(backgroundColorValue: string, borderTopColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue
    } as const;
}
export function createTextInputColorBorderColorStyle(colorValue: string, borderColorValue: string) {
    return {
        color: colorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

