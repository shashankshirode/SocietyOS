import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.infoLight,
        borderColor: Colors.info,
        borderWidth: 1,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
        alignItems: 'flex-start',
    },
    text: {
        ...Typography.caption,
        color: Colors.info,
        flex: 1,
        lineHeight: 16,
        fontWeight: '500',
    },
});
