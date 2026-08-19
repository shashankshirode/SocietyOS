import { StyleSheet } from "react-native";
import { Layout } from "../../../../../shared/theme/layout";
export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16
    },
    responsiveContainer: {
        width: "100%",
        maxWidth: Layout.maxTabletContentWidth,
        alignSelf: "center",
        gap: 20
    },
    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        marginBottom: 8
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center"
    },
    summaryDetails: {
        flex: 1
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 14,
        fontWeight: "600"
    },
    messageInput: {
        height: 140,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingTop: 12,
        fontSize: 14,
        fontWeight: "600"
    },
    topicSection: {
        marginTop: 16
    },
    chipsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderRadius: 22,
        borderWidth: 1,
        gap: 6,
        minHeight: 44
    },
    privacySection: {
        marginTop: 16,
        marginBottom: 16
    },
    privacyCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14
    },
    privacyHeader: {
        flexDirection: "row",
        alignItems: "center"
    }
});
export function createSafeTextColorStyle(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginBottom: 2
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
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
        marginBottom: 8
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#101828" | "#FFFFFF" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: "600"
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginLeft: 8
    } as const;
}
export function createSafeTextColorStyle9(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 6,
        marginLeft: 28
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
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
export function createViewBackgroundColorStyle2(backgroundColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#D8464A" | "#FF8588" | "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle2(colorValue: "#101828" | "#F8FAFC", backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#D8464A" | "#FF8588" | "#253149" | "#E2E6EE") {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableScaleBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "#4E46E5" | "#9DA5FF" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#F9FAFD" | "#172033", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

