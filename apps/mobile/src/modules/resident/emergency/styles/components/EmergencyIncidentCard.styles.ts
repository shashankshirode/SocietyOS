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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    incNum: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    typeText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    location: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginVertical: Spacing.xs,
    },
    desc: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontSize: 13,
        marginBottom: Spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.xs,
        marginTop: Spacing.xs,
    },
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    severity: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.danger,
    },
});
