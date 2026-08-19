import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderLeftWidth: 4,
        borderLeftColor: Colors.danger,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
        marginRight: Spacing.md,
    },
    alertType: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    message: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    society: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textMuted,
    },
    date: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
