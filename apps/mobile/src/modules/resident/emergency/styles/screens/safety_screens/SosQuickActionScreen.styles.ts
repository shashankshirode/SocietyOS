import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/theme";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        justifyContent: 'center',
        padding: Spacing.md,
    },
    content: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
        marginTop: Spacing.md,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginVertical: Spacing.md,
    },
    triggerBtn: {
        backgroundColor: Colors.danger,
        borderRadius: Layout.borderRadius.md,
        width: '100%',
        paddingVertical: Spacing.md,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    pressed: {
        opacity: 0.9,
    },
    triggerText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '800',
    },
    cancelBtn: {
        paddingVertical: Spacing.sm,
    },
    cancelText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    disclaimer: {
        ...Typography.caption,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing.lg,
    },
});
