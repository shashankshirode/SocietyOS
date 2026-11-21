import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 6,
        borderRadius: Layout.borderRadius.sm,
        gap: 4,
    },
    exportBtnText: {
        color: Colors.white,
        ...Typography.caption,
        fontWeight: '600',
    },
    tableCard: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        flex: 1,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.neutralLight,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderTopLeftRadius: Layout.borderRadius.md,
        borderTopRightRadius: Layout.borderRadius.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    colHeader: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.neutral,
    },
    colName: { flex: 2 },
    colDays: { width: 45, textAlign: 'center' },
    colPct: { width: 50, textAlign: 'right' },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    nameText: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    codeText: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    rowText: {
        ...Typography.body,
        fontSize: 13,
        color: Colors.textPrimary,
    },
    boldText: {
        fontWeight: '600',
    },
    dangerText: {
        color: Colors.danger,
        fontWeight: '600',
    },
    warningText: {
        color: Colors.warning,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: Spacing.md,
    },
});
