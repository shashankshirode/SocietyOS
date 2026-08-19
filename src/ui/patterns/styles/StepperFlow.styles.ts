import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    headerArea: {
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 2,
    },
    indicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    stepDotWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepLine: {
        flex: 1,
        height: 2,
        marginHorizontal: 4,
        borderRadius: 1,
    },
    stepTitleArea: {
        paddingHorizontal: 20,
        gap: 4,
        marginBottom: 8,
    },
    scrollArea: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
    footer: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderRadius: 14,
    },
    backBtn: {
        flex: 1,
        borderWidth: 1,
    },
    nextBtn: {
        flex: 2,
    },
    safeTextColorFontSizeFontWeight: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
    safeTextFontWeight: { fontWeight: '600' },
    safeTextColorFontWeight: { color: '#FFFFFF', fontWeight: '700' },
    animatedViewFlex: { flex: 2 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontSize: 10,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

