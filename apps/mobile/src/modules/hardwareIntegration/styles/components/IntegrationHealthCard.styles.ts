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
        color: Colors.textPrimary,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    text: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    action: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
