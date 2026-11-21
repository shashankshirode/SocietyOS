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
        marginBottom: Spacing.lg,
    },
    detailsCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    titleBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    categoryBadge: {
        backgroundColor: Colors.primaryLight + '10',
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: Layout.borderRadius.sm,
    },
    categoryText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    docTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        fontWeight: '700',
        fontSize: 20,
        marginBottom: Spacing.xs,
    },
    docDesc: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        lineHeight: 18,
        marginTop: Spacing.xs,
    },
    borderDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    previewCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    cardSectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    restrictedPreviewBox: {
        height: 160,
        backgroundColor: Colors.dangerLight + '05',
        borderWidth: 1,
        borderColor: Colors.dangerLight + '25',
        borderRadius: Layout.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    restrictedPreviewText: {
        ...Typography.bodySmall,
        color: Colors.danger,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: Spacing.sm,
        lineHeight: 18,
    },
    missingPreviewBox: {
        height: 160,
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        borderRadius: Layout.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
    },
    missingPreviewText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    uploadCta: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    securePreviewBox: {
        height: 180,
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
    },
    previewFilename: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: Spacing.sm,
    },
    previewSize: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    securePreviewNote: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    actionsContainer: {
        marginTop: Spacing.xs,
    },
    btnRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    shareBtn: {
        marginTop: Spacing.md,
    },
    auditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    auditText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
    },
    viewLogsBtn: {
        alignItems: 'center',
        marginTop: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    viewLogsText: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
});
