import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    requestCard: {
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
    personInfo: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    purposeText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        fontStyle: 'italic',
        marginVertical: Spacing.sm,
        lineHeight: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
    },
    durationText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    actionPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    actionPromptText: {
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
    textColor: { color: Colors.success }
});

