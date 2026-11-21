import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    pressed: {
        opacity: 0.9,
        backgroundColor: Colors.neutralLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    number: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    staffName: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    body: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginBottom: Spacing.sm,
        gap: Spacing.xs,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        ...Typography.caption,
        color: Colors.neutral,
        width: 80,
    },
    value: {
        ...Typography.caption,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    highlight: {
        color: Colors.primary,
        fontWeight: '600',
    },
    reason: {
        ...Typography.caption,
        color: Colors.neutral,
        fontStyle: 'italic',
        marginTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.xs,
    },
    meta: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 10,
    },
});
