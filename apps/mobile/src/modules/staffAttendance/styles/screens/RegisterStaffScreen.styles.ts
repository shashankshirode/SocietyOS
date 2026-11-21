import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md
    },
    header: {
        marginBottom: Spacing.lg
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral
    },
    form: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.xl,
        gap: Spacing.md
    },
    inputGroup: {
        gap: Spacing.xs
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        height: 44,
        ...Typography.body
    },
    inputError: {
        borderColor: Colors.danger
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger
    },
    categoryOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
    categoryOption: { minHeight: 36, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.borderRadius.sm, paddingHorizontal: Spacing.sm, alignItems: 'center', justifyContent: 'center' },
    categoryOptionSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    categoryOptionText: { ...Typography.caption, color: Colors.textPrimary },
    categoryOptionTextSelected: { color: Colors.white, fontWeight: '600' },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingVertical: Spacing.xs
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.md
    },
    submitButtonPressed: {
        opacity: 0.9
    },
    submitText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '600'
    }
});
