import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    wrapper: { paddingHorizontal: 20, gap: 12 },
    sectionHeader: { paddingHorizontal: 0 },
    card: {
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        overflow: 'hidden',
        gap: 14
    },
    pattern: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 140,
        height: 140,
        borderRadius: 70,
        opacity: 0.5,
        transform: [{ translateX: 40 }, { translateY: -40 }]
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    walletIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center'
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2
    },
    amount: { fontSize: 36, fontWeight: '800', lineHeight: 42 },
    currencySymbol: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
    dueLabel: { fontSize: 11, fontWeight: '700', marginLeft: 10, marginBottom: 4 },
    moreBillsButton: {
        minHeight: 44,
        justifyContent: 'center'
    },
    partialRow: {
        alignSelf: 'flex-start',
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    tags: { marginTop: -4 },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    lastPaidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 2
    },
    payBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 18,
        minHeight: 44,
        paddingVertical: 10,
        borderRadius: 12
    },
    payBtnText: { fontWeight: '700', fontSize: 13 },
    secondaryBtn: {
        paddingHorizontal: 14,
        minHeight: 44,
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1
    },
    viewMarginLeftAlignSelf: { marginLeft: 10, alignSelf: 'center' },
    safeTextFontSize: { fontSize: 10 }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600',
        fontSize: 12
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600',
        fontSize: 12
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
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

