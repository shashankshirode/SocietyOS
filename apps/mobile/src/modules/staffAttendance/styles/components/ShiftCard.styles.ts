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
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    location: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    timeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginBottom: Spacing.sm,
    },
    timeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    timeText: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    graceText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    infoText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    staffCount: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    assignButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        paddingVertical: Spacing.xs,
    },
    buttonPressed: {
        backgroundColor: Colors.primaryLight,
    },
    assignText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
});
