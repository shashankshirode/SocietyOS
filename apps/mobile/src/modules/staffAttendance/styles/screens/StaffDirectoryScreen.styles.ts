import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Layout.borderRadius.sm,
        gap: 4,
    },
    addText: {
        color: Colors.white,
        ...Typography.caption,
        fontWeight: '600',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.sm,
        height: 44,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.xs,
        ...Typography.body,
    },
    filtersContainer: {
        marginBottom: Spacing.md,
    },
    chipsContent: {
        gap: Spacing.sm,
    },
    filterChip: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    activeChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        ...Typography.caption,
        color: Colors.neutral,
        fontWeight: '500',
    },
    activeChipText: {
        color: Colors.white,
    },
    listContent: {
        paddingBottom: Spacing.xl,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: Spacing.sm,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.neutral,
        textAlign: 'center',
    },
});
