import { Platform, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    listContent: { padding: 16, gap: 4, flexGrow: 1 },
    messageWrapper: { width: '100%' },
    receivedBubbleContainer: { alignSelf: 'flex-start', maxWidth: '82%' },
    sentBubbleContainer: { alignSelf: 'flex-end', maxWidth: '82%' },
    receivedBubble: { borderWidth: 1, borderRadius: 16, borderBottomLeftRadius: 4, padding: 12 },
    sentBubble: { borderRadius: 16, borderBottomRightRadius: 4, padding: 12, gap: 4 },
    metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
    dateSeparator: { alignSelf: 'center', marginVertical: 12 },
    contextStrip: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
    contextHeader: { flexDirection: 'row', alignItems: 'center' },
    contextBody: { marginTop: 6, paddingLeft: 22 },
    composer: { borderTopWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
    inputContainer: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, maxHeight: 120 },
    input: { flex: 1, fontSize: 14, paddingVertical: Platform.OS === 'ios' ? 6 : 0, textAlignVertical: 'top' },
    sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    footerLoader: { paddingVertical: 12, alignItems: 'center' },
    pressableMarginTop: { marginTop: 2 }
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
        color: colorValue,
        flex: 1,
        marginLeft: 6,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 2
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        padding: 4
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderBottomColorStyle(backgroundColorValue: string, borderBottomColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBackgroundColorBorderTopColorPaddingBottomStyle(backgroundColorValue: string, borderTopColorValue: string, paddingBottomValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue,
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
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
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

