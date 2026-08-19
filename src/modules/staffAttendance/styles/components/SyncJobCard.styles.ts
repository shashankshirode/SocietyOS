import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    jobId: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    device: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginBottom: Spacing.sm,
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 10,
    },
    statVal: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    successText: { color: Colors.success },
    warningText: { color: Colors.warning },
    dangerText: { color: Colors.danger },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    timeText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    triggerText: {
        ...Typography.caption,
        color: Colors.neutral,
        fontWeight: '500',
    },
});
