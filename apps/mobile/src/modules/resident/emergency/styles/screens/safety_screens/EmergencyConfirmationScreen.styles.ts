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
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginVertical: Spacing.md,
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
        backgroundColor: Colors.danger,
        borderColor: Colors.danger,
    },
    confirmText: {
        ...Typography.body,
        color: Colors.danger,
        fontWeight: '700',
        flex: 1,
    },
    btn: {
        backgroundColor: Colors.danger,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        width: '100%',
        alignItems: 'center',
    },
    pressed: { opacity: 0.9 },
    btnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '800',
    },
});
