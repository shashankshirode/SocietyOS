import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    messages: { flex: 1 },
    messageContent: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 12, paddingVertical: 10 },
    searchContainer: { paddingHorizontal: 12, paddingVertical: 8 },
    errorBanner: { paddingHorizontal: 16, paddingVertical: 7 },
    loadOlder: { alignSelf: 'center', minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
    newMessages: { position: 'absolute', right: 16, bottom: 78, minHeight: 36, borderRadius: 18, justifyContent: 'center', paddingHorizontal: 14 },
    pressableWidthHeightJustifyContentAlignItems: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' }
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
        marginVertical: 24
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

