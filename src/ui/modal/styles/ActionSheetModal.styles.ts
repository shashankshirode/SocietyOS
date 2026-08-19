import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Radius } from "../../../shared/theme/radius";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    actions: {
        paddingHorizontal: Spacing.sm,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.sm,
    },
    actionIcon: {
        marginRight: Spacing.md,
    },
    actionLabel: {
        ...Typography.body,
        flex: 1,
    },
    disabled: {
        opacity: 0.4,
    },
    cancelContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        paddingTop: Spacing.sm,
    },
    cancelBtn: {
        borderRadius: Radius.button,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    cancelText: {
        ...Typography.button,
    },
});
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

