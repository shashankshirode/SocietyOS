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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    name: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    status: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.success,
    },
    role: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    contact: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
