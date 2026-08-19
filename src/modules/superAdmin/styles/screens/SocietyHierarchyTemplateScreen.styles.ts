import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    scroll: {
        padding: Spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    levels: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    example: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    notes: {
        ...Typography.caption,
        color: Colors.textMuted,
        lineHeight: 16,
    },
});
