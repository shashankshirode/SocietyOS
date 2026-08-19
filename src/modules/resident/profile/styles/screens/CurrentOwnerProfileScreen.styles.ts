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
    ownerName: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    ownerSub: {
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
    actionsContainer: {
        marginTop: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    shortcutsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    shortcutBtn: {
        flex: 1,
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        gap: 4,
    },
    shortcutText: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    animatedViewMarginTop: { marginTop: Spacing.md }
});

