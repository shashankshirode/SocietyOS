import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    scroll: {
        padding: Spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: Spacing.lg,
    },
    cardTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    bodyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});
