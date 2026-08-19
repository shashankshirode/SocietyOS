import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    compact: {
        padding: Spacing.sm,
        flex: 0,
    },
    skeleton: {
        alignSelf: 'stretch',
        marginBottom: Spacing.md,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    message: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
});
