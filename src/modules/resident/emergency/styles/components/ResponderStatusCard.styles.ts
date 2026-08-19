import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    role: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
