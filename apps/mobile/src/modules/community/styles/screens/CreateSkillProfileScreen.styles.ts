import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    scrollContent: {
        padding: Spacing.md,
        gap: Spacing.md
    },
    errorContainer: {
        backgroundColor: Colors.dangerLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.dangerLight
    },
    errorText: {
        ...Typography.body,
        color: Colors.danger,
        fontWeight: '500'
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.xs
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.sm
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.card
    },
    categoryChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary
    },
    categoryChipText: {
        ...Typography.caption,
        fontWeight: '500',
        color: Colors.textPrimary
    },
    categoryChipTextSelected: {
        color: '#FFF'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    buttonContainer: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl
    }
});
