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
    unit: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    text: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    consumption: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.primary,
    },
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
