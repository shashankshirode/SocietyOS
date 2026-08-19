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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    infoCol: {
        flex: 1,
        marginRight: Spacing.md,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    flag: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
