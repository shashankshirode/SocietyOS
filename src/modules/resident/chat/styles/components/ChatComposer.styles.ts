import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { borderTopWidth: 1, paddingHorizontal: 12, paddingTop: 9, paddingBottom: 10, gap: 7 },
    field: { minHeight: 48, maxHeight: 120, borderWidth: 1, borderRadius: 24, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 15, paddingRight: 5, paddingVertical: 5 },
    input: { flex: 1, minHeight: 36, maxHeight: 104, paddingTop: 8, paddingBottom: 7, fontSize: 15 },
    sendButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
});
export function createViewBackgroundColorBorderTopColorStyle(backgroundColorValue: string, borderTopColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

