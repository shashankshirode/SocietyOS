import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: Colors.warningLight,
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    alertText: {
        ...Typography.caption,
        color: Colors.warning,
        flex: 1,
        fontWeight: '500',
    },
    checklistCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    checkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    checkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
    },
    itemLabel: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    itemLabelChecked: {
        textDecorationLine: 'line-through',
        color: Colors.neutral,
    },
    approveButton: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    approveButtonPressed: {
        opacity: 0.9,
    },
    approveText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '600',
    },
});
