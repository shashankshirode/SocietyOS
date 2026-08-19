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
        marginBottom: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.neutral,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutralLight,
    },
    label: {
        ...Typography.body,
        color: Colors.neutral,
    },
    value: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    saveBtnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '600',
    },
    pressed: { opacity: 0.9 },
});
