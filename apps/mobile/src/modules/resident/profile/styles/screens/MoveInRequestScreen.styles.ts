import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl
    },
    bannerMargin: {
        marginBottom: Spacing.md
    },
    formCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.md
    },
    inputGroup: {
        marginBottom: Spacing.md
    },
    label: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm
    },
    btnToggleRow: {
        flexDirection: 'row',
        backgroundColor: Colors.neutralLight,
        borderRadius: Layout.borderRadius.md,
        padding: 3
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: Layout.borderRadius.sm
    },
    toggleBtnActive: {
        backgroundColor: Colors.primary
    },
    toggleText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        fontSize: 10
    },
    toggleTextActive: {
        color: Colors.textOnPrimary
    },
    textInput: {
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 48,
        color: Colors.textPrimary,
        ...Typography.bodySmall
    },
    inputError: {
        borderColor: Colors.danger
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: 4
    },
    borderDivider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md
    },
    toggleItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toggleLabels: {
        flex: 1,
        marginRight: Spacing.md
    },
    toggleTitle: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary
    },
    toggleDesc: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        lineHeight: 12,
        marginTop: 2
    },
    switchCircle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.neutral,
        justifyContent: 'center',
        padding: 2
    },
    switchCircleActive: {
        backgroundColor: Colors.primary
    },
    switchKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.surface
    },
    switchKnobActive: {
        alignSelf: 'flex-end'
    },
    submitBtn: {
        height: 52
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Layout.screenHorizontalPadding
    },
    successIconOuter: {
        marginBottom: Spacing.lg
    },
    successTitle: {
        ...Typography.screenTitle,
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.sm
    },
    successSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md
    },
    summaryCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        marginBottom: Spacing.md
    },
    summaryTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center'
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight
    },
    noBorder: {
        borderBottomWidth: 0
    },
    rowLabel: {
        ...Typography.bodySmall,
        color: Colors.textSecondary
    },
    rowVal: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary
    },
    stepsTitle: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: Spacing.md
    },
    stepItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.sm
    },
    stepText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '500'
    },
    stepTextApproved: {
        color: Colors.success,
        fontWeight: '700'
    },
    bottomSpacer: {
        height: Spacing.xxl
    },
    textInput2: {},
    textInput3: {},
    viewMarginTop: { marginTop: Spacing.md },
    viewMarginTop2: { marginTop: Spacing.md }
});

