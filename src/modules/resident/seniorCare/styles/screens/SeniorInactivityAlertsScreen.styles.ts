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
    listHeader: {
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
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    flat: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    details: {
        backgroundColor: Colors.surfaceMuted,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginVertical: Spacing.sm,
        gap: 4,
    },
    detailText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    btn: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnEsc: {
        backgroundColor: Colors.danger,
    },
    btnText: {
        color: Colors.white,
        ...Typography.caption,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
});
