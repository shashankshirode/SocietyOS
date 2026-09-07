import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingTop: 16 },
    contentStack: { gap: 18 },
    section: { gap: 10 },
    usageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    metadataCard: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 12 },
    metadataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
    guidanceCard: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 12 },
    actions: { gap: 10, flexDirection: 'row', flexWrap: 'wrap' },
    loadingStack: { paddingVertical: 16, gap: 18 },
    loadingHero: { height: 210, borderRadius: 20 },
    loadingCard: { height: 170, borderRadius: 18 },
    statusProgressContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    statusProgressRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressInner: {
        alignItems: 'center',
    },
    statusBadges: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    amountBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    guidanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    guidanceIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryAction: {
        flex: 1,
        minWidth: '45%',
    },
    secondaryAction: {
        flex: 1,
        minWidth: '45%',
    },
    guidanceTitle: {
        flex: 1,
    },
    guidanceContent: {
        gap: 12,
    },
    guidanceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    guidanceRows: {
        gap: 8,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700',
        textAlign: 'right'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle6(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
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

