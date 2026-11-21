import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    content: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    resetText: {
        ...Typography.body,
        color: Colors.neutral,
        fontWeight: '500',
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    sortContainer: {
        gap: Spacing.sm,
    },
    sortRow: {
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        backgroundColor: Colors.card,
    },
    sortRowSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    sortLabel: {
        ...Typography.body,
        color: Colors.textPrimary,
    },
    sortLabelSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    priceInput: {
        flex: 1,
    },
    toText: {
        ...Typography.body,
        color: Colors.neutral,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    toggleLabel: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    toggleSublabel: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    conditionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    conditionChip: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.card,
    },
    conditionChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    conditionChipText: {
        ...Typography.caption,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    conditionChipTextSelected: {
        color: '#FFF',
    },
    buttonContainer: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.xl,
    },
});
