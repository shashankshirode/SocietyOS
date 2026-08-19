import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        overflow: 'hidden',
        gap: 16,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    headerLeft: {
        gap: 2,
    },
    amountContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        gap: 4,
    },
    amount: {
        fontSize: 34,
        fontWeight: '800',
    },
    fields: {
        gap: 10,
    },
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    safeTextFontWeight: { fontWeight: '600' }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        flex: 1
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#198A59" | "#D8464A" | "#5BD39A" | "#FF8588") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: "#253149" | "#E2E6EE") {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

