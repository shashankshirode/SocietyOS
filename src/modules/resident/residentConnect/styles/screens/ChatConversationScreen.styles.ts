import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 12,
    },
    messageWrapper: {
        maxWidth: '80%',
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        gap: 4,
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
    },
    inputBar: {
        padding: 12,
        borderTopWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    input: {
        flex: 1,
        fontSize: 14,
        maxHeight: 80,
        paddingVertical: 4,
    },
    sendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyboardAvoidingViewFlex: { flex: 1 }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewAlignSelfStyle(alignSelfValue: "flex-start" | "flex-end") {
    return {
        alignSelf: alignSelfValue
    } as const;
}
export function createViewBackgroundColorBorderColorBorderWidthStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE", borderWidthValue: 0 | 1) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        borderWidth: borderWidthValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467" | "#FFFFFF80") {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderTopColorPaddingBottomStyle(borderTopColorValue: "#253149" | "#E2E6EE", paddingBottomValue: number) {
    return {
        borderTopColor: borderTopColorValue,
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

