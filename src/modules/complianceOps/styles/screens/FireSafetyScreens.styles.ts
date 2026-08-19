import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    scroll: {
        padding: Spacing.md,
        paddingBottom: Spacing.xxl
    },
    list: {
        padding: Spacing.md
    },
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
        fontWeight: '700'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl
    },
    errorText: {
        ...Typography.body,
        color: Colors.textSecondary
    },
    actionSection: {
        marginBottom: Spacing.lg
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formLabel: {
        ...Typography.formLabel,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs
    },
    checklistHeader: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.md
    },
    hkCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    reportTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2
    },
    reportSub: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2
    },
    auditTime: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontWeight: '600'
    },
    auditRole: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '700'
    },
    auditAction: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        fontWeight: '600',
        marginVertical: Spacing.xs
    },
    auditActor: {
        ...Typography.caption,
        color: Colors.textSecondary
    },
    settingsGroupTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.md
    },
    appCardMarginBottom: { marginBottom: Spacing.lg },
    appButtonMarginBottom: { marginBottom: Spacing.sm },
    appButtonFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    appButtonFlex: { flex: 1 },
    appCardMarginBottom2: { marginBottom: Spacing.lg },
    appCardMarginBottom3: { marginBottom: Spacing.xl },
    viewMarginTop: { marginTop: Spacing.md },
    appButtonMarginTop: { marginTop: Spacing.md },
    appCardMarginBottom4: { marginBottom: Spacing.lg },
    appCardMarginBottom5: { marginBottom: Spacing.lg },
    viewFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    appCardMarginBottom6: { marginBottom: Spacing.lg },
    appCardMarginBottom7: { marginBottom: Spacing.lg }
});

