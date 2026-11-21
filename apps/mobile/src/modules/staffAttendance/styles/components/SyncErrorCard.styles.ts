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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    errorIcon: {
        marginRight: Spacing.xs,
    },
    type: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    device: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    body: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.sm,
        borderRadius: Layout.borderRadius.sm,
        marginBottom: Spacing.sm,
        gap: Spacing.xs,
    },
    message: {
        ...Typography.body,
        fontSize: 13,
        color: Colors.textPrimary,
        fontWeight: '500',
        marginBottom: Spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
    },
    label: {
        ...Typography.caption,
        color: Colors.neutral,
        width: 100,
    },
    value: {
        ...Typography.caption,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    suggestion: {
        ...Typography.caption,
        color: Colors.info,
        fontWeight: '500',
        marginTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
    },
    btn: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Layout.borderRadius.sm,
        borderWidth: 1,
    },
    btnPri: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    btnSec: {
        backgroundColor: Colors.white,
        borderColor: Colors.border,
    },
    btnTextPri: {
        ...Typography.caption,
        color: Colors.white,
        fontWeight: '600',
    },
    btnTextSec: {
        ...Typography.caption,
        color: Colors.neutral,
        fontWeight: '500',
    },
    pressed: { opacity: 0.8 },
    resolutionBox: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        gap: 2,
    },
    resolutionTitle: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    resolutionText: {
        ...Typography.caption,
        color: Colors.neutral,
        fontStyle: 'italic',
    },
    resolutionMeta: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 9,
        marginTop: 2,
    },
});
