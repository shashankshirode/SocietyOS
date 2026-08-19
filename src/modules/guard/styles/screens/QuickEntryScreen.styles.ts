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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: 4,
        marginBottom: Spacing.lg,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: Layout.borderRadius.sm,
    },
    tabBtnActive: {
        backgroundColor: Colors.primary,
    },
    tabBtnText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        fontSize: 10,
    },
    tabBtnTextActive: {
        color: Colors.textOnPrimary,
    },
    formCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    textInput: {
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 48,
        color: Colors.textPrimary,
        ...Typography.bodySmall,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: 4,
    },
    partnerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    partnerChip: {
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    partnerChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    partnerChipText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    partnerChipTextActive: {
        color: Colors.textOnPrimary,
    },
    submitBtn: {
        height: 52,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Layout.screenHorizontalPadding,
    },
    successIconOuter: {
        marginBottom: Spacing.lg,
    },
    successTitle: {
        ...Typography.screenTitle,
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    successSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        marginBottom: Spacing.xl,
    },
    summaryTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    doneBtn: {
        height: 50,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    textInput2: {},
    textInput3: {},
    textInput4: {},
    textInput5: {},
    textInput6: {},
    textInput7: {},
    textInput8: {},
    textInput9: {},
    textInput10: {}
});

