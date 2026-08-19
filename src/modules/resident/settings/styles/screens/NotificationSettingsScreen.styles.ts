import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Typography } from "../../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        gap: Spacing.lg,
    },
    card: {
        padding: Spacing.md,
        borderRadius: 14,
        borderWidth: 1,
    },
    title: {
        ...Typography.cardTitle,
        marginBottom: Spacing.md,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.bodySmall,
    },
    statusVal: {
        ...Typography.bodySmall,
        fontWeight: '700',
    },
    btn: {
        marginTop: Spacing.xs,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    toggleText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    importantTag: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    infoBox: {
        gap: Spacing.sm,
        paddingHorizontal: Spacing.sm,
    },
    infoText: {
        ...Typography.caption,
        lineHeight: 16,
    },
    syncText: {
        ...Typography.caption,
        lineHeight: 16,
        fontStyle: 'italic',
    },
});
export function createViewPaddingBottomStyle(paddingBottomValue: number) {
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
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomWidth: 1,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle7(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle8(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

