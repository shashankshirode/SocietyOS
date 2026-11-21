import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    timeline: { gap: 0 },
    timelineItem: { flexDirection: 'row', gap: 12, minHeight: 104 },
    timelineLeft: { alignItems: 'center', width: 20 },
    node: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    },
    nodeInner: { width: 4, height: 4, borderRadius: 2 },
    line: { width: 2, flex: 1, marginTop: -1 },
    card: {
        flex: 1,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        marginBottom: 10,
        gap: 8,
        elevation: 2,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 14
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    typeIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardHeaderText: { flex: 1, gap: 1 },
    cardMeta: { gap: 6 },
    metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
    metaText: { flex: 1 },
    securityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 9,
        paddingHorizontal: 9,
        paddingVertical: 7
    },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    otpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6
    },
    emptyState: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        gap: 12
    },
    emptyCta: {
        minHeight: 44,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 4
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        flex: 1,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600',
        fontSize: 10
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewPaddingLeftPaddingRightStyle(paddingLeftValue: number, paddingRightValue: number) {
    return {
        paddingLeft: paddingLeftValue,
        paddingRight: paddingRightValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
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

