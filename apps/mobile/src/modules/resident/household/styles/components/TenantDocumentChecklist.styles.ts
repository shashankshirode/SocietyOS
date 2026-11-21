import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    list: {
        gap: 16,
    },
    section: {
        gap: 8,
    },
    sectionHeader: {
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
        paddingLeft: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    content: {
        flex: 1,
        gap: 2,
    },
    safeTextMarginLeftFontWeight: { marginLeft: 8, fontWeight: '700' }
});
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

