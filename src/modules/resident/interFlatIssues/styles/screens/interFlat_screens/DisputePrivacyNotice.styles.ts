import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        alignItems: 'center',
    },
    text: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
