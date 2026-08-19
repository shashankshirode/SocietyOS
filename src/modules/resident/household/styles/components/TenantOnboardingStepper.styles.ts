import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    gridContainer: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        gap: 10,
    },
    gridTitle: {
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 11,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    gridItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        gap: 6,
    },
    gridDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollStyle: {
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 12,
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    stepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 6,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connector: {
        width: 24,
        height: 2,
        marginHorizontal: 8,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "500" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue,
        flex: 1
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
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

