import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    scrollContent: {
        padding: 20,
        gap: 24,
        paddingBottom: 120
    },
    section: {
        gap: 12
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 8
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        backgroundColor: 'transparent'
    }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewPaddingBottomBorderTopColorStyle(paddingBottomValue: number, borderTopColorValue: "#253149" | "#E2E6EE") {
    return {
        paddingBottom: paddingBottomValue,
        borderTopColor: borderTopColorValue
    } as const;
}

