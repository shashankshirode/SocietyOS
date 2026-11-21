import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingVertical: 12 },
    contentStack: { gap: 16 },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    gridItem: {
        width: '48%',
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        height: 48,
        paddingHorizontal: 14,
        fontSize: 16,
    },
    breakdownCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    divider: {
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
    },
    viewFlex: { flex: 1 },
    safeTextMarginTop: { marginTop: 2 },
    safeTextMarginBottom: { marginBottom: 12 },
    safeTextMarginBottom2: { marginBottom: 6 },
    safeTextMarginBottom3: { marginBottom: 12 },
    safeTextFontWeight: { fontWeight: '600' },
    safeTextFlex: { flex: 1 }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextFontWeightStyle(fontWeightValue: "400" | "700") {
    return {
        fontWeight: fontWeightValue
    } as const;
}
export function createTextInputColorBorderColorBackgroundColorStyle(colorValue: string, borderColorValue: string, backgroundColorValue: string) {
    return {
        color: colorValue,
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
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
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createAnimatedViewBackgroundColorBorderColorStyle3(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewMarginBottomStyle(marginBottomValue: number) {
    return {
        marginTop: 8,
        marginBottom: marginBottomValue
    } as const;
}

