import { StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
    },
    action: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
    },
});
