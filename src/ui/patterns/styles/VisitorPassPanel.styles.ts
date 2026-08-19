import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        position: 'relative',
        gap: 16,
        overflow: 'hidden',
    },
    cutoutLeft: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        left: -10,
        top: '40%',
    },
    cutoutRight: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        right: -10,
        top: '40%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
        gap: 2,
    },
    passContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        gap: 16,
    },
    qrPlaceholder: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
    otpSection: {
        alignItems: 'center',
        gap: 4,
    },
    otpText: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: 4,
    },
    regenBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    details: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    cancelBtn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
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
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
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
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}
export function createSafeTextColorStyle9(colorValue: "#D8464A" | "#FF8588") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#F4F6FB" | "#080D18", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: "#F4F6FB" | "#080D18", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: "#253149" | "#E2E6EE") {
    return {
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle10(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue
    } as const;
}
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue,
        flex: 2
    } as const;
}
export function createPressableScaleBorderColorStyle(borderColorValue: "#D8464A" | "#FF8588") {
    return {
        borderColor: borderColorValue,
        flex: 1
    } as const;
}

