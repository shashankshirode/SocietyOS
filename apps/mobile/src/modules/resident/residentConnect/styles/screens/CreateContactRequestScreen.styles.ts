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
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        marginBottom: 2
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        marginBottom: 8
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: "600"
    } as const;
}
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue,
        marginLeft: 8
    } as const;
}
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 6,
        marginLeft: 28
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle(colorValue: string, backgroundColorValue: string, borderColorValue: string) {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorBackgroundColorBorderColorStyle2(colorValue: string, backgroundColorValue: string, borderColorValue: string) {
    return {
        color: colorValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createPressableScaleBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

