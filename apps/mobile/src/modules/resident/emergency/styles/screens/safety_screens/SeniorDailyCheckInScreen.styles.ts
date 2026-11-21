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
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    statusCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    statusLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    statusText: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: Spacing.xs,
    },
    successText: { color: Colors.success },
    pendingText: { color: Colors.warning },
    actions: {
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    checkInBtn: {
        backgroundColor: Colors.success,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '800',
        marginTop: Spacing.xs,
    },
    helpBtn: {
        backgroundColor: Colors.warning,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    helpBtnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '700',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    historyCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.sm,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    historyDate: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    historyStatus: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
});
