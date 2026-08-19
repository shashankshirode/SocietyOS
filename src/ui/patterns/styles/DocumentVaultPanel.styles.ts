import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    vault: {
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    vaultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 12,
        paddingBottom: 8,
    },
    docRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
    },
    docIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    docText: { flex: 1, gap: 4 },
    docMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    summaryRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    addRow: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        justifyContent: 'center',
    },
    safeTextFontWeight: { fontWeight: '600' }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderTopColorBorderBottomColorStyle(borderTopColorValue: string, borderBottomColorValue: string) {
    return {
        borderTopColor: borderTopColorValue,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomWidth: 1,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

