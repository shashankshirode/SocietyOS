import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FEE2E2',
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: '#F87171',
    },
    icon: {
        marginRight: Spacing.sm,
        marginTop: 2,
    },
    text: {
        ...Typography.bodySmall,
        color: '#991B1B',
        flex: 1,
        lineHeight: 16,
    },
});
