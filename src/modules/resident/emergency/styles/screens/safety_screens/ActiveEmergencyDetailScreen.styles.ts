import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/theme";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    scroll: {
        padding: Spacing.md,
    },
    headerCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incNum: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    typeTitle: {
        ...Typography.h1,
        color: Colors.danger,
        marginVertical: Spacing.xs,
    },
    location: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    linkText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    val: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    dangerText: {
        color: Colors.danger,
    },
    descBox: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        marginTop: Spacing.xs,
    },
    descText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontSize: 14,
        marginTop: 2,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        paddingVertical: Spacing.md,
    },
    actionsGrid: {
        gap: Spacing.sm,
    },
    actionBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    safeBtn: {
        backgroundColor: Colors.success,
    },
    closeBtn: {
        backgroundColor: Colors.textSecondary,
    },
    actionBtnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '700',
    },
});
