import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        color: Colors.neutral,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 120,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginVertical: Spacing.xs,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 24,
    },
    headerInfo: {
        flex: 1,
        gap: 2,
    },
    title: {
        ...Typography.h3,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    ratingText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    reviewsText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    infoGrid: {
        gap: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
    skillChip: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: Layout.borderRadius.full,
    },
    skillChipText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
    },
    descriptionText: {
        ...Typography.body,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    reviewsList: {
        gap: Spacing.md,
    },
    reviewItem: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        gap: 4,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewerName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    reviewerRating: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    reviewComment: {
        ...Typography.body,
        color: Colors.textPrimary,
        fontSize: 13,
        lineHeight: 18,
    },
    reviewDate: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 10,
        marginTop: 2,
    },
    noReviewsText: {
        ...Typography.body,
        color: Colors.neutral,
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        padding: Spacing.md,
    },
});
