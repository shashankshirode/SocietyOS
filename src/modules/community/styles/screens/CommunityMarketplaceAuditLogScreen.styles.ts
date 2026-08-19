import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    logCard: {
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
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    logAction: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    logTime: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 10,
    },
    logDetails: {
        ...Typography.body,
        color: Colors.textPrimary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: Spacing.sm,
    },
    logFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
    },
    logUser: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    roleBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Layout.borderRadius.sm,
    },
    roleText: {
        ...Typography.caption,
        fontSize: 9,
        fontWeight: '700',
        color: Colors.primary,
    },
});
