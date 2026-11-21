import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/theme";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
    },
    row: {
        flexDirection: 'row',
        minHeight: 60,
    },
    lineBox: {
        alignItems: 'center',
        width: 24,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        marginTop: 6,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: Colors.border,
        marginVertical: 4,
    },
    content: {
        flex: 1,
        marginLeft: Spacing.sm,
        paddingBottom: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actor: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    time: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    type: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 2,
    },
    note: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontSize: 13,
        marginTop: 2,
    },
});
