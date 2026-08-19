import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    info: {
        flex: 1,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    rel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    priority: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 2,
    },
});
