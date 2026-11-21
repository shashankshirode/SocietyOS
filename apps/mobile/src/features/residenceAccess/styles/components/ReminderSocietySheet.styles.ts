import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxl,
        gap: Spacing.lg
    },
    infoCard: {
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.xs
    },
    notice: {
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.xs
    },
    section: {
        gap: Spacing.sm
    },
    reason: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm
    },
    reasonText: {
        flex: 1
    },
    success: {
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.lg
    },
    center: {
        textAlign: 'center'
    }
});
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorBackgroundColorOpacityStyle(borderColorValue: string, backgroundColorValue: string, opacityValue: 1 | 0.45) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        opacity: opacityValue
    } as const;
}

