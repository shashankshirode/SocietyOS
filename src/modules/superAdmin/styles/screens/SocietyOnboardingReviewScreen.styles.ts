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
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    label: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    val: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    checkItem: {
        ...Typography.bodySmall,
        color: Colors.success,
        marginBottom: Spacing.xs,
    },
    btnBox: {
        marginTop: Spacing.lg,
    },
});
