import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    stepIndicator: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
        gap: 8
    },
    barContainer: {
        flexDirection: 'row',
        gap: 8
    },
    bar: {
        flex: 1,
        height: 4,
        borderRadius: 2
    },
    stepLabel: {
        fontWeight: '700'
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 120
    },
    formSection: {
        gap: 16
    },
    reviewCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginTop: 10
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1
    },
    safeTextMarginBottom: { marginBottom: 12 },
    viewFlex: { flex: 1 },
    viewFlex2: { flex: 1.5 }
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
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderTopColorBackgroundColorStyle(borderTopColorValue: string, backgroundColorValue: string) {
    return {
        borderTopColor: borderTopColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

