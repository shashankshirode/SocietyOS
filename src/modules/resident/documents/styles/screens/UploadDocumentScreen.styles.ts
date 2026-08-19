import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    scrollContent: {
        paddingBottom: 120
    },
    formContainer: {
        paddingHorizontal: 20,
        gap: 16,
        paddingTop: 12
    },
    list: {
        gap: 10
    },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
    evidenceGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8
    },
    evidenceBtn: {
        flex: 1
    },
    evidenceBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    evidencePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
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
    switchText: {
        flex: 1,
        gap: 2
    },
    reviewCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8
    },
    reviewFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 8,
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
        color: colorValue,
        marginBottom: 8
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700',
        flex: 1
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue,
        fontWeight: '700',
        flex: 1
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle10(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginBottom: 12
    } as const;
}
export function createSafeTextColorStyle11(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle12(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle13(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#1E1B4B" | "#E8E5FB", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: "#253149" | "#E2E6EE", backgroundColorValue: "#FFFFFF" | "#111827") {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle2(borderColorValue: "#253149" | "#E2E6EE", backgroundColorValue: "#FFFFFF" | "#111827") {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#1E1B4B" | "#E8E5FB", borderColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle2(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewPaddingBottomBorderTopColorStyle(paddingBottomValue: number, borderTopColorValue: "#253149" | "#E2E6EE") {
    return {
        paddingBottom: paddingBottomValue,
        borderTopColor: borderTopColorValue
    } as const;
}

