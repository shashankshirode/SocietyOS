import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    list: {
        padding: Spacing.md,
    },
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        fontWeight: '700',
    },
    scoreCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primarySoft,
        borderColor: Colors.primaryLight,
        borderWidth: 1,
    },
    scoreNum: {
        ...Typography.displayLarge,
        fontSize: 48,
        fontWeight: '800',
        color: Colors.primary,
    },
    scoreLabel: {
        ...Typography.bodySmall,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: Spacing.xs,
    },
    filterContainer: {
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    errorText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    detailCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    actionSection: {
        marginBottom: Spacing.lg,
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formLabel: {
        ...Typography.formLabel,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    appButtonFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    appButtonFlex: { flex: 1 },
    appCardMarginBottom: { marginBottom: Spacing.xl },
    filterChipsMarginBottom: { marginBottom: Spacing.lg },
    filterChipsMarginBottom2: { marginBottom: Spacing.lg },
    appButtonMarginTop: { marginTop: Spacing.md }
});

