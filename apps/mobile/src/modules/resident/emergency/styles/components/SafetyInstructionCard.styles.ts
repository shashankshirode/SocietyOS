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
    category: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
    },
    title: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    steps: {
        ...Typography.body,
        fontSize: 13,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
});
