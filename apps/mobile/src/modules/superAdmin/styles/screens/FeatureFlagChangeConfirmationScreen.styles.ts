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
    card: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    value: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    btnBox: {
        marginTop: Spacing.lg,
    },
});
