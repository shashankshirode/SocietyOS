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
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: Colors.infoLight,
        borderColor: Colors.info,
        borderWidth: 1,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
        alignItems: 'center',
    },
    alertText: {
        ...Typography.caption,
        color: Colors.info,
        flex: 1,
        fontWeight: '500',
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    vendorName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    invoiceMonth: {
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
        fontSize: 9,
    },
    statVal: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 2,
    },
    verifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: Layout.borderRadius.sm,
        paddingVertical: Spacing.xs,
        gap: 4,
    },
    btnPressed: {
        backgroundColor: Colors.primaryLight,
    },
    verifyBtnText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: Spacing.xl,
    },
    textColor: { color: Colors.success }
});

