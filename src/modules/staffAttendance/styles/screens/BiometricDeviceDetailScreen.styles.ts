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
        width: 85,
        height: 85,
        borderRadius: 42.5,
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
    },
    linkText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
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
    emptyText: {
        ...Typography.body,
        color: Colors.neutral,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    mappingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutralLight,
    },
    mappingName: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    mappingCode: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 1,
    },
    actions: {
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
});
