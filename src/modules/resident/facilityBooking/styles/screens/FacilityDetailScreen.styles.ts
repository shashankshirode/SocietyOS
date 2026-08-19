import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    divider: {
        height: 1,
    },
    specGrid: {
        gap: 8,
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    section: {
        gap: 10,
    },
    rulesCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    action: {
        marginTop: 8,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontSize: 18
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

