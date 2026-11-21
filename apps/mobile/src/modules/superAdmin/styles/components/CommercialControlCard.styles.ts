import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    grid: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    col: {
        flex: 1,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    value: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    badge: {
        alignSelf: 'flex-start',
    },
    notesBox: {
        backgroundColor: Colors.surfaceMuted,
        padding: Spacing.sm,
        borderRadius: 6,
    },
    notesText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
});
