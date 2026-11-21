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
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    historyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        gap: 4,
    },
    historyBtnText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
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
        marginBottom: Spacing.sm,
    },
    link: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.neutral,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: Spacing.sm,
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    rowTitle: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    rowSubtitle: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    lateMinutes: {
        ...Typography.caption,
        color: Colors.warning,
        fontWeight: '600',
    },
    shiftEnd: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    statLabel: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    statValue: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.neutral,
    },
});
