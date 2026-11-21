import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: 2,
    },
    displayName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    flagKey: {
        ...Typography.caption,
        fontFamily: 'Courier',
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    meta: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
});
