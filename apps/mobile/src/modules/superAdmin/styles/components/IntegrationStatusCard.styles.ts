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
    category: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        gap: Spacing.lg,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    value: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    danger: {
        color: Colors.danger,
    },
});
