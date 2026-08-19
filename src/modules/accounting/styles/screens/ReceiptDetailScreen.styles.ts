import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.xl
    },
    headerVisual: {
        alignItems: 'center',
        marginBottom: Spacing.xl
    },
    successCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.successLight + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md
    },
    receiptNum: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs
    },
    amount: {
        ...Typography.screenTitle,
        fontSize: 36,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm
    },
    detailsCard: {
        padding: Spacing.md,
        marginBottom: Spacing.xl
    },
    sectionTitle: {
        ...Typography.sectionTitle,
        marginBottom: Spacing.md,
        color: Colors.textPrimary
    },
    actionBtn: {
        marginBottom: Spacing.md
    },
    doneBtn: {
        marginBottom: Spacing.xxl
    }
});
