import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.sm,
        gap: Spacing.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.sm,
        height: 44,
    },
    searchIcon: {
        marginRight: Spacing.xs,
    },
    searchInput: {
        flex: 1,
        ...Typography.body,
        color: Colors.textPrimary,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 4,
    },
    serviceReqButton: {
        width: 44,
        height: 44,
        borderRadius: Layout.borderRadius.md,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    myProfileText: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.primary,
    },
    categoriesContainer: {
        paddingVertical: Spacing.sm,
    },
    listContent: {
        padding: Spacing.md,
        paddingBottom: 40,
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
