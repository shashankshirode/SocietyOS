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
    mainContainer: {
        flex: 1,
    },
    filterOuter: {
        height: 48,
        marginVertical: Spacing.xs,
        justifyContent: 'center',
    },
    filterScroll: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        gap: Spacing.xs,
        alignItems: 'center',
    },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterChipText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        fontSize: 10,
    },
    filterChipTextActive: {
        color: Colors.textOnPrimary,
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.sm,
    },
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    recipientFlat: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    recipientName: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    badgesRow: {
        alignItems: 'flex-end',
        gap: 4,
    },
    badge: {
        paddingVertical: 1,
        paddingHorizontal: 6,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    subjectText: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    previewText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        lineHeight: 14,
    },
    rejectionNotice: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginTop: Spacing.sm,
    },
    rejectionText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    categoryBadge: {
        backgroundColor: Colors.primaryLight + '10',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryText: {
        ...Typography.caption,
        color: Colors.primary,
        fontSize: 9,
        fontWeight: '700',
    },
    dateText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
    },
    footerLoader: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    textColor: { color: Colors.danger }
});
export function createFlatListPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}

