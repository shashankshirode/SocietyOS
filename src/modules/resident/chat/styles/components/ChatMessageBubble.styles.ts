import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    row: { width: '100%', marginVertical: 3, position: 'relative' },
    outgoingRow: { alignItems: 'flex-end' },
    incomingRow: { alignItems: 'flex-start' },
    bubble: { maxWidth: '80%', minWidth: 110, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 },
    meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
    replyIconContainer: { position: 'absolute', left: 6, top: '50%', transform: [{ translateY: -14 }], width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
});
export function createSafeTextColorMarginTopStyle(colorValue: string, marginTopValue: 0 | 6) {
    return {
        color: colorValue,
        marginTop: marginTopValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
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
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

