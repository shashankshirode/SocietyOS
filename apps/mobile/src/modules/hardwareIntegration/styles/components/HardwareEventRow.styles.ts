import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    left: {
        flex: 1,
    },
    title: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginVertical: 2,
    },
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    right: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});
