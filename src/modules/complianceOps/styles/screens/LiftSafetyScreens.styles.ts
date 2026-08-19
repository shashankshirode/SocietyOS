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
    hkCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface,
    },
    appCardMarginBottom: { marginBottom: Spacing.lg },
    appButtonMarginBottom: { marginBottom: Spacing.sm },
    appButtonFlexMarginRight: { flex: 1, marginRight: Spacing.sm },
    appButtonFlex: { flex: 1 },
    appCardMarginBottom2: { marginBottom: Spacing.xl },
    filterChipsMarginBottom: { marginBottom: Spacing.lg },
    appButtonMarginTop: { marginTop: Spacing.md }
});

