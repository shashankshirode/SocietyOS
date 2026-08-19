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
    evidenceGrid: {
        marginTop: 8
    },
    evidenceBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 14,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
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
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        backgroundColor: 'transparent'
    },
    pressableScaleFlex: { flex: 1 }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
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
export function createSafeTextColorStyle6(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
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

