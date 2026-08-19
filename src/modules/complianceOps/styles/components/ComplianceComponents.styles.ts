import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    metricCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        backgroundColor: Colors.surface,
    },
    metricValue: {
        ...Typography.displayMedium,
        color: Colors.primary,
        fontWeight: '800',
        marginBottom: Spacing.xs,
    },
    metricLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontWeight: '600',
    },
    metricNote: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
        fontSize: 10,
    },
    taskCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    taskNumber: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    cardTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.xs,
    },
    cardSub: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    calendarDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    calTime: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.primary,
    },
    calTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    calSub: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    hkCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
    },
    pickupTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    pickupSub: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    miniBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 8,
        marginTop: Spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniBtnText: {
        ...Typography.caption,
        color: '#fff',
        fontWeight: '700',
    },
    checklistCard: {
        marginBottom: Spacing.sm,
        backgroundColor: Colors.surface,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.borderStrong,
        borderRadius: 6,
        marginRight: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checklistText: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        fontWeight: '500',
        flex: 1,
    },
    liftNumber: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    noticeBox: {
        marginVertical: Spacing.md,
    },
    viewFlexMarginLeftMarginRight: { flex: 1, marginLeft: Spacing.md, marginRight: Spacing.xs },
    viewFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    viewAlignItemsJustifyContent: { alignItems: 'flex-end', justifyContent: 'center' }
});

