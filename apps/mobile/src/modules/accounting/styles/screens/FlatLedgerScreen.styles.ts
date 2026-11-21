import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    summaryPanel: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderColor: Colors.border,
    },
    panelTitle: {
        ...Typography.sectionTitle,
        fontSize: 18,
        color: Colors.textPrimary,
    },
    owner: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    summaryBoxGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    summaryBoxItem: {
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        alignItems: 'center',
    },
    summaryBoxLbl: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    summaryBoxVal: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: Spacing.xs,
    },
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    card: {
        padding: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    entryDate: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    desc: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    refNum: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    amountsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    lbl: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    debitVal: {
        ...Typography.bodySmall,
        color: Colors.danger,
        fontWeight: '600',
        marginTop: Spacing.xs,
    },
    creditVal: {
        ...Typography.bodySmall,
        color: Colors.success,
        fontWeight: '600',
        marginTop: Spacing.xs,
    },
    balanceVal: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        fontWeight: '600',
        marginTop: Spacing.xs,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAlignItems: { alignItems: 'center' },
    viewAlignItems2: { alignItems: 'flex-end' },
    viewFlex: { flex: 1 },
    textColor: { color: Colors.success }
});

