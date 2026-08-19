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
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
        gap: Spacing.xs,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    loc: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    severity: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.danger,
    },
    instructionsCard: {
        backgroundColor: Colors.surfaceMuted,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    instTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    instText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    actions: {
        gap: Spacing.md,
    },
    btn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSec: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    btnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '700',
    },
    btnTextSec: {
        color: Colors.primary,
        ...Typography.body,
        fontWeight: '700',
    },
});
