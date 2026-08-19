import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/theme";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    scroll: {
        padding: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    form: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.md,
    },
    inputGroup: {
        gap: Spacing.xs,
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        height: 44,
        ...Typography.body,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingVertical: Spacing.xs,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkboxError: {
        borderColor: Colors.danger,
    },
    checkboxLabel: {
        ...Typography.body,
        color: Colors.textPrimary,
        flex: 1,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    typeBtn: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '47%',
    },
    typeBtnActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    typeText: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    typeTextActive: {
        color: Colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: { opacity: 0.9 },
    submitText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '800',
    },
});
