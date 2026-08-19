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
    checklistHeader: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    hkCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
    },
    appCardMarginBottom: { marginBottom: Spacing.lg },
    appButtonFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    appButtonFlex: { flex: 1 },
    appCardMarginBottom2: { marginBottom: Spacing.xl },
    appButtonMarginTop: { marginTop: Spacing.lg },
    appCardMarginBottom3: { marginBottom: Spacing.xl },
    filterChipsMarginBottom: { marginBottom: Spacing.lg },
    filterChipsMarginBottom2: { marginBottom: Spacing.lg },
    appButtonMarginTop2: { marginTop: Spacing.md },
    appCardMarginBottom4: { marginBottom: Spacing.xl },
    filterChipsMarginBottom3: { marginBottom: Spacing.lg },
    appButtonMarginTop3: { marginTop: Spacing.md },
    appCardMarginBottom5: { marginBottom: Spacing.xl },
    filterChipsMarginBottom4: { marginBottom: Spacing.lg },
    appButtonMarginTop4: { marginTop: Spacing.md }
});

