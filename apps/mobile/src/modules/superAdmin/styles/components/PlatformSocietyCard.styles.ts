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
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    titleCol: {
        flex: 1,
        marginRight: Spacing.md,
    },
    name: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
    },
    location: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.md,
    },
    col: {
        flex: 1,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    value: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    badge: {
        alignSelf: 'flex-start',
    },
});
