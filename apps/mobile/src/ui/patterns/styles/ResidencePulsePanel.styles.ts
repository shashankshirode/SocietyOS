import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    titleBlock: {
        paddingHorizontal: 20,
        gap: 2,
    },
    card: {
        marginHorizontal: 20,
        borderRadius: 22,
        borderWidth: 1,
        padding: 18,
        gap: 16,
        elevation: 2,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
    },
    statusBand: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 14,
        gap: 12,
    },
    statusIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: { flex: 1, gap: 2 },
    indicators: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    indicator: {
        flexGrow: 1,
        flexBasis: '30%',
        minWidth: 104,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 2,
    },
    indicatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginBottom: 2,
    },
    chipLabel: {
        fontWeight: '800',
    },
    chipValue: {
        fontWeight: '700',
    },
    recommendation: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        paddingTop: 12,
        gap: 8,
    },
    recommendationText: { flex: 1 },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
export function createViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
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
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}

