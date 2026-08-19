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
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    tktNumCol: {
        flex: 1,
        marginRight: Spacing.md,
    },
    ticketNumber: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
    },
    societyName: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    subject: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    metaCol: {
        alignItems: 'flex-end',
    },
    slaText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.success,
    },
    slaBreached: {
        color: Colors.danger,
    },
    dateText: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
});
