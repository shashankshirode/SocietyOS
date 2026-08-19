import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    reqCard: {
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
        alignItems: 'center',
        marginBottom: Spacing.xs,
        gap: Spacing.sm,
    },
    cardTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Layout.borderRadius.sm,
    },
    categoryText: {
        ...Typography.caption,
        fontSize: 9,
        fontWeight: '700',
        color: Colors.primary,
    },
    cardDesc: {
        ...Typography.caption,
        color: Colors.neutral,
        lineHeight: 16,
        marginBottom: Spacing.sm,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
    },
    cardUnit: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    cardBudget: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
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
