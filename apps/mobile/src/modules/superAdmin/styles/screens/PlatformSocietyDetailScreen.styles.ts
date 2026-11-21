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
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    grid: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    val: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    badge: {
        alignSelf: 'flex-start',
    },
    actionsBox: {
        marginTop: Spacing.md,
        gap: Spacing.md,
    },
    viewMarginTop: { marginTop: Spacing.md }
});

