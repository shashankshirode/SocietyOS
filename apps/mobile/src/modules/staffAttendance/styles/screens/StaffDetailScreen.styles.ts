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
    profileHeader: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    name: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    code: {
        ...Typography.body,
        color: Colors.neutral,
        marginTop: 2,
    },
    badges: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    infoCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        gap: Spacing.sm,
    },
    infoRow: {
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
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: Layout.borderRadius.sm,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.sm,
        gap: 4,
    },
    mapButtonText: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
    },
    actions: {
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    actionButtonText: {
        ...Typography.body,
        color: Colors.white,
        fontWeight: '600',
    },
    dangerButton: {
        backgroundColor: Colors.danger,
    },
});
