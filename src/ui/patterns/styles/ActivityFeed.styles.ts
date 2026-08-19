import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 10
    },
    feedCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden'
    },
    emptyCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        gap: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        gap: 10
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 5
    },
    rowBody: {
        flex: 1,
        minWidth: 0,
        gap: 2
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8
    },
    rowTitle: {
        flex: 1,
        fontWeight: '600'
    },
    statusChip: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 6
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        fontSize: 10,
        textTransform: 'uppercase'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
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
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewSpread1Style(spread1Value: Partial<Record<"backgroundColor", string>>) {
    return {
        ...spread1Value
    } as const;
}
