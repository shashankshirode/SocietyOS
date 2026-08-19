import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    scroll: {
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
        color: Colors.textSecondary,
    },
    notice: {
        marginVertical: Spacing.md,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
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
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    val: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    actions: {
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    btn: {
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.md,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    btnSec: {
        backgroundColor: Colors.white,
        borderWidth: 1,
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
