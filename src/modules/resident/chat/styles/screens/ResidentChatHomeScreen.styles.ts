import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    list: { paddingBottom: 140 },
    emptyList: { flexGrow: 1 },
    controls: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
    filters: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 4 },
    filter: { minHeight: 36, minWidth: 72, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
    emptyContainer: { flex: 1, minHeight: 280, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    requestLinks: { flexDirection: 'row', gap: 8, marginTop: 10 },
    requestLink: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
    badge: { minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    directConversation: { minHeight: 72, borderWidth: 1, borderRadius: 16, padding: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
    directAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    directDetails: { flex: 1, minWidth: 0, gap: 2 },
    fab: { position: 'absolute', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 6 },
    footerLoader: { paddingVertical: 12, alignItems: 'center' },
    ioniconsMarginBottom: { marginBottom: 12 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        flex: 1
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
        flex: 1
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
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle10(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 6,
        marginBottom: 20
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle3(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle4(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableScaleBackgroundColorWidthHeightBorderRadiusBottomStyle(backgroundColorValue: string, widthValue: 60 | 56, heightValue: 60 | 56, borderRadiusValue: number, bottomValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue,
        bottom: bottomValue,
        right: 16
    } as const;
}

