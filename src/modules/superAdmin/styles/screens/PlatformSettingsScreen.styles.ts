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
    groupTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    groupDesc: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    settingsList: {
        gap: Spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    settingInfo: {
        flex: 1,
        marginRight: Spacing.md,
    },
    settingLabel: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    settingDesc: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    settingVal: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.primary,
    },
});
