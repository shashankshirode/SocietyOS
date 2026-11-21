import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    titleCol: {
        flex: 1,
        marginRight: Spacing.md,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    city: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    scoreCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreVal: {
        ...Typography.body,
        fontWeight: '800',
    },
    details: {
        gap: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    weakestText: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    actionBox: {
        backgroundColor: Colors.primaryLight + '08',
        padding: Spacing.sm,
        borderRadius: 6,
        marginTop: Spacing.xs,
    },
    actionText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

