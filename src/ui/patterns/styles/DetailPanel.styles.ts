import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: 16, gap: 16, paddingBottom: 100 },
    headerCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12
    },
    headerTextArea: {
        flex: 1,
        gap: 2
    },
    fieldGrid: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden'
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 10
    },
    fieldText: {
        flex: 1,
        gap: 1
    },
    actionBar: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1
    },
    animatedViewFlexMinWidth: { flex: 1, minWidth: 100 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        fontSize: 13
    } as const;
}
export function createAnimatedViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomWidth: 1,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createScrollViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

