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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    backButton: {
        padding: Spacing.xs,
        marginRight: Spacing.xs
    },
    headerText: {
        flex: 1
    },
    title: {
        ...Typography.screenTitle,
        color: Colors.textPrimary
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2
    },
    scroll: {
        flex: 1
    },
    content: {
        padding: Spacing.md
    },
    contentWithFooter: {
        paddingBottom: Spacing.xxl + 20
    },
    footer: {
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background
    },
    actionTile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.sm
    },
    pressed: {
        opacity: 0.7
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: Layout.borderRadius.sm,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md
    },
    actionIconDanger: {
        backgroundColor: '#FEE2E2'
    },
    actionText: {
        flex: 1
    },
    actionTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary
    },
    actionSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2
    },
    metricCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        margin: 4
    },
    metricValue: {
        ...Typography.screenTitle,
        fontWeight: '700',
        color: Colors.primary
    },
    metricLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 4,
        textAlign: 'center'
    },
    metricNote: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2
    },
    detailCard: {
        marginBottom: Spacing.md
    },
    detailCardTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm
    },
    detailCardContent: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.xs
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border
    },
    detailRowLast: {
        borderBottomWidth: 0
    },
    detailRowLabel: {
        ...Typography.body,
        color: Colors.textSecondary
    },
    detailRowValue: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textPrimary
    },
    warningContainer: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        marginBottom: Spacing.md,
        alignItems: 'center'
    },
    warningText: {
        ...Typography.caption,
        color: '#D97706',
        flex: 1
    },
    pickerContainer: {
        marginBottom: Spacing.md
    },
    pickerLabel: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        backgroundColor: Colors.card
    },
    pickerText: {
        ...Typography.body,
        color: Colors.textSecondary
    },
    selectorContainer: {
        marginBottom: Spacing.md
    },
    selectorLabel: {
        ...Typography.body,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4
    },
    optionButton: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.card,
        margin: 4
    },
    optionButtonSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight
    },
    optionText: {
        ...Typography.body,
        color: Colors.textPrimary
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '600'
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: Spacing.xs
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    ioniconsMarginRight: { marginRight: Spacing.xs },
    ioniconsMarginRight2: { marginRight: Spacing.xs },
    appButtonWidth: { width: '100%' }
});

