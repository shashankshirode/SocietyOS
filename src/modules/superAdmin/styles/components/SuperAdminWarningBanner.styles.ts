import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.warningSoft || '#FFFBEB',
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.warningLight || '#FDE68A',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    text: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        flex: 1,
        lineHeight: 16,
    },
});
