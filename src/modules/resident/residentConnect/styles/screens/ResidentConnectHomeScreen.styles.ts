import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    unavailableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 8,
    },
    scrollContent: {
        padding: 20,
        gap: 24,
        paddingBottom: 40,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    list: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 14,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginTop: 16
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        textAlign: 'center',
        marginTop: 8
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

