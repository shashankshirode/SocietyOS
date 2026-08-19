import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    myListingCard: {
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
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    titleSection: {
        flex: 1,
    },
    itemTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    itemPrice: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 2,
    },
    itemMeta: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
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
    primaryButton: {
        backgroundColor: Colors.primary,
    },
    primaryButtonText: {
        ...Typography.caption,
        fontWeight: '600',
        color: '#FFF',
    },
    secondaryButton: {
        backgroundColor: Colors.primaryLight,
    },
    secondaryButtonText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.primary,
    },
    editIcon: {
        width: 36,
        height: 36,
        borderRadius: Layout.borderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldText: {
        ...Typography.caption,
        color: Colors.success,
        fontWeight: '600',
        flex: 1,
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
    errorText: { ...Typography.caption, color: Colors.danger, textAlign: 'center', padding: Spacing.sm },
});
