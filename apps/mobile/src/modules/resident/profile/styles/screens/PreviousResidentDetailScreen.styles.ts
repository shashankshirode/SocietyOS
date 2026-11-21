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
        marginBottom: Spacing.md,
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
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
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
    badgeInline: {
        paddingVertical: 1,
        paddingHorizontal: 6,
    },
    notesBox: {
        marginTop: Spacing.md,
        backgroundColor: Colors.neutralLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.sm,
    },
    notesLabel: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    notesText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 10,
        lineHeight: 14,
        marginTop: 2,
    },
    documentsCard: {
        backgroundColor: Colors.surface,
    },
    docHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    docTitle: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    docSub: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    lockWarning: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        fontStyle: 'italic',
        lineHeight: 12,
        marginVertical: Spacing.md,
    },
    btnCta: {
        marginTop: Spacing.xs,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    viewFlexMarginLeft: { flex: 1, marginLeft: Spacing.md }
});

