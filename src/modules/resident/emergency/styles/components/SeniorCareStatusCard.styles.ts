import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
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
        alignItems: 'center',
    },
    avatar: {
        marginRight: Spacing.sm,
    },
    info: {
        flex: 1,
    },
    name: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    flat: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    details: {
        marginTop: Spacing.md,
        backgroundColor: Colors.surfaceMuted,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        gap: Spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    val: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
});
