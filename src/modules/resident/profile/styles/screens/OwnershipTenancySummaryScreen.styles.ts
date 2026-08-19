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
    statsCardGrid: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    statCardItem: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statNum: {
        ...Typography.sectionTitle,
        fontWeight: '800',
        color: Colors.primary,
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginTop: 4,
    },
    breakdownCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.md,
    },
    breakdownTitle: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: Spacing.md,
    },
    issueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    issueDetails: {
        flex: 1,
        marginLeft: Spacing.md,
        marginRight: Spacing.sm,
    },
    issueText: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    issueSub: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        marginTop: 2,
    },
    issueStatusText: {
        ...Typography.caption,
        color: Colors.success,
        fontWeight: '800',
        fontSize: 9,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    textColor: { color: Colors.danger },
    textColor2: { color: Colors.warning }
});

