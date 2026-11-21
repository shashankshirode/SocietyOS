import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xs,
    },
    row: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    leftColumn: {
        alignItems: 'center',
        marginRight: Spacing.md,
        width: 14,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.borderStrong,
        zIndex: 1,
        marginTop: 4,
    },
    dotCompleted: {
        backgroundColor: Colors.primary,
    },
    line: {
        width: 2,
        position: 'absolute',
        top: 14,
        bottom: -18,
        backgroundColor: Colors.border,
    },
    lineCompleted: {
        backgroundColor: Colors.primarySoft,
    },
    rightColumn: {
        flex: 1,
    },
    textHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
    },
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    description: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: 4,
        lineHeight: 18,
    },
});
