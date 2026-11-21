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
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    formTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    inputGroup: {
        gap: 4,
    },
    label: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.sm,
        height: 40,
        ...Typography.body,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
    },
    addBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    pressed: { opacity: 0.9 },
    addBtnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '600',
    },
    listTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
});
