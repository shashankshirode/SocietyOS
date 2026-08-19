import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    title: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.danger,
    },
    device: {
        ...Typography.bodySmall,
        fontWeight: '500',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    message: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    action: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontStyle: 'italic',
    },
});
