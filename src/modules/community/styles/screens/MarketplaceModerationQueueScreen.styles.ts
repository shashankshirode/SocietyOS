import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    modCard: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    sellerInfo: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    reportBadge: {
        backgroundColor: Colors.dangerLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Layout.borderRadius.sm,
    },
    reportBadgeText: {
        ...Typography.caption,
        fontSize: 9,
        fontWeight: '700',
        color: Colors.danger,
    },
    reasonText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        fontStyle: 'italic',
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginVertical: Spacing.md,
        lineHeight: 16,
    },
    actionRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: Layout.borderRadius.sm,
        flex: 1,
        height: 36,
    },
    approveButton: {
        backgroundColor: Colors.successLight,
    },
    approveButtonText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.success,
    },
    removeButton: {
        backgroundColor: Colors.dangerLight,
    },
    removeButtonText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.danger,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl * 2,
    },
    emptyTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        ...Typography.caption,
        color: Colors.neutral,
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: Spacing.xl,
    },
});
