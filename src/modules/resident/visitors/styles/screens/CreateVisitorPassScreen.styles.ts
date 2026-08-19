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
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    typeItem: {
        width: '48%',
        flexGrow: 1
    },
    typeCard: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        gap: 8
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1
    },
    timeChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 70,
        alignItems: 'center'
    },
    previewContainer: {
        paddingHorizontal: 20,
        paddingTop: 12
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1
    },
    calendarContainer: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        gap: 12
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    arrowButton: {
        padding: 6
    },
    weekdayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    weekdayText: {
        width: '14.28%',
        textAlign: 'center',
        fontWeight: '700'
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    dayCell: {
        width: '14.28%',
        height: 38,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 8
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
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
export function createSafeTextColorStyle5(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 12,
        marginBottom: 4
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#101828" | "#F8FAFC") {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "400" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 12,
        marginBottom: 4
    } as const;
}
export function createSafeTextColorStyle10(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle11(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle12(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 8
    } as const;
}
export function createSafeTextColorStyle13(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle14(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginBottom: 12
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
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
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: "#253149" | "#E2E6EE", backgroundColorValue: "#FFFFFF" | "#111827") {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle15(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        borderWidth: 1,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle2(borderColorValue: "#253149" | "#E2E6EE", backgroundColorValue: "#FFFFFF" | "#111827") {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: "transparent" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle4(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewPaddingBottomBorderTopColorBackgroundColorStyle(paddingBottomValue: number, borderTopColorValue: "#253149" | "#E2E6EE", backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        paddingBottom: paddingBottomValue,
        borderTopColor: borderTopColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

