import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    row: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    actor: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    event: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.primary,
        marginVertical: 2,
    },
    meta: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
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
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
