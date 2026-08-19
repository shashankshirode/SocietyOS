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
    notice: {
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowInfo: {
        flex: 1,
        marginRight: Spacing.md,
    },
    rowTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    rowDesc: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
    contactRow: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    contactName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    contactPhone: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    priority: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
    },
    btn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.white,
        ...Typography.body,
        fontWeight: '700',
    },
});
