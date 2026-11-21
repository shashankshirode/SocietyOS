import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginTop: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
    },
    meta: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    actions: {
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
});
