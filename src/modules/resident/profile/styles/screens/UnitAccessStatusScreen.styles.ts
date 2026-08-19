import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
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
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    bannerMargin: {
        marginBottom: Spacing.md,
    },
    statusHeaderCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    residentName: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    residentSub: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    auditRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    auditLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    auditVal: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        maxWidth: '70%',
    },
    sectionHeader: {
        ...Typography.cardTitle,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    capabilityCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.xs,
        padding: Spacing.md,
    },
    capRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    capIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.primaryLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    capDetails: {
        flex: 1,
        marginRight: Spacing.md,
    },
    capLabel: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    capDesc: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        lineHeight: 12,
        marginTop: 2,
    },
    switchCircle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.neutral,
        justifyContent: 'center',
        padding: 2,
    },
    switchCircleActive: {
        backgroundColor: Colors.primary,
    },
    switchKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.surface,
    },
    switchKnobActive: {
        alignSelf: 'flex-end',
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
});
