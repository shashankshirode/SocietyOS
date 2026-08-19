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
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: Colors.warningLight,
        borderColor: Colors.warning,
        borderWidth: 1,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    alertText: {
        ...Typography.caption,
        color: Colors.warning,
        flex: 1,
        fontWeight: '500',
    },
    form: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.xl,
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
    inputError: {
        borderColor: Colors.danger,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingVertical: Spacing.xs,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    submitButtonPressed: {
        opacity: 0.9,
    },
    submitText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '600',
    },
});
