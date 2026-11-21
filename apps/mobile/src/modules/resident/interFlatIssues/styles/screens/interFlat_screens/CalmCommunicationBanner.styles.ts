import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.infoLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        borderLeftWidth: 3,
        borderLeftColor: Colors.info,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.info,
        marginBottom: 2,
    },
    text: {
        ...Typography.caption,
        color: Colors.info,
        lineHeight: 16,
    },
});
