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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerMargin: {
        marginBottom: Spacing.md,
    },
    profileCard: {
        backgroundColor: Colors.surface,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cardHeaderTitle: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primaryLight + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    avatarText: {
        ...Typography.sectionTitle,
        fontWeight: '800',
        color: Colors.primary,
    },
    tenantName: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    tenantSub: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    sectionSubHeader: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: Spacing.md,
    },
    badgeInline: {
        paddingVertical: 2,
        paddingHorizontal: Spacing.sm,
    },
    actions: {
        marginTop: Spacing.lg,
    },
    ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
    },
    ctaDetails: {
        flex: 1,
        marginLeft: Spacing.md,
        marginRight: Spacing.sm,
    },
    ctaTitle: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    ctaDesc: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    pressableMarginTop: { marginTop: Spacing.sm },
    pressableMarginTop2: { marginTop: Spacing.sm },
    textColor: { color: Colors.danger }
});

