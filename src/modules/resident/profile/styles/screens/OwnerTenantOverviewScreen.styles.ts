import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    statusCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.md,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    societyName: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    unitTypeLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    ownerSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    ownerSummaryCol: {
        flex: 1,
    },
    tenantSummaryCol: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.borderLight,
        paddingLeft: Spacing.md,
    },
    ownerLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    ownerName: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    metricItem: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    metricNum: {
        ...Typography.sectionTitle,
        fontWeight: '800',
        color: Colors.primary,
    },
    metricLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
        fontSize: 10,
        fontWeight: '600',
    },
    sectionHeader: {
        ...Typography.cardTitle,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    actionsCard: {
        backgroundColor: Colors.surface,
        padding: 0,
        overflow: 'hidden',
        marginBottom: Spacing.md,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: Spacing.md,
    },
    actionIconOuter: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.primaryLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    actionLabel: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    actionSub: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    pressed: {
        opacity: 0.7,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    viewFlex: { flex: 1 }
});

