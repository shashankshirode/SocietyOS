import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 24,
        paddingBottom: 40,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 4,
    },
    viewFlex: { flex: 1 },
    safeTextMarginTop: { marginTop: 2 },
    scrollViewMaxHeightPaddingHorizontal: { maxHeight: 350, paddingHorizontal: 16 },
    safeTextMarginBottom: { marginBottom: 12 },
    safeTextMarginBottom2: { marginBottom: 8 },
    viewGapMarginBottom: { gap: 8, marginBottom: 16 },
    ioniconsMarginRight: { marginRight: 10 },
    viewMarginBottom: { marginBottom: 16 },
    safeTextMarginBottom3: { marginBottom: 6 }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        borderRadius: 8,
        backgroundColor: backgroundColorValue,
        borderWidth: 1,
        borderColor: borderColorValue,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextInputBorderColorColorBackgroundColorStyle(borderColorValue: string, colorValue: string, backgroundColorValue: string) {
    return {
        borderWidth: 1,
        borderColor: borderColorValue,
        borderRadius: 8,
        padding: 10,
        color: colorValue,
        backgroundColor: backgroundColorValue,
        minHeight: 60,
        textAlignVertical: 'top'
    } as const;
}

