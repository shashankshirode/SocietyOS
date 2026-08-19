import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    imageContainer: {
        height: 140,
        borderRadius: Layout.borderRadius.sm,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    conditionBadgeContainer: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
    },
    cardContent: {
        gap: Spacing.xs,
    },
    title: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    description: {
        ...Typography.caption,
        color: Colors.neutral,
        lineHeight: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    price: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.primary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
        justifyContent: 'flex-end',
    },
    metaText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    headerInfo: {
        flex: 1,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginVertical: Spacing.sm,
    },
    skillChip: {
        backgroundColor: Colors.neutralLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Layout.borderRadius.full,
    },
    skillChipText: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textPrimary,
    },
    moreSkillsText: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.neutral,
        alignSelf: 'center',
    },
    cardFooterBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
        marginTop: Spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
    experienceText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    borrowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: Layout.borderRadius.sm,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    borrowFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    durationText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    depositRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    depositText: {
        ...Typography.caption,
        color: Colors.success,
        fontWeight: '500',
    },
    lostFoundHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    typeBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Layout.borderRadius.sm,
    },
    typeBadgeText: {
        ...Typography.caption,
        fontSize: 10,
        fontWeight: '700',
    },
    lostFoundDate: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    lostFoundFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    banner: {
        flexDirection: 'row',
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
    },
    privacyBanner: {
        backgroundColor: Colors.infoLight,
        borderColor: Colors.infoLight,
    },
    safetyBanner: {
        backgroundColor: Colors.warningLight,
        borderColor: Colors.warningLight,
    },
    bannerIcon: {
        marginRight: Spacing.sm,
        marginTop: 2,
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    bannerDescription: {
        ...Typography.caption,
        color: Colors.textPrimary,
        lineHeight: 16,
    },
    viewBackgroundColor: { backgroundColor: Colors.infoLight }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

