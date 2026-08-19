import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    metricCard: {
        flex: 1,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    metricValue: {
        ...Typography.h2,
        fontWeight: '700',
        color: Colors.primary,
    },
    metricLabel: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.neutral,
        textAlign: 'center',
        marginTop: 2,
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    gridCard: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridTitle: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    activityList: {
        backgroundColor: Colors.card,
        borderRadius: Layout.borderRadius.md,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        padding: Spacing.md,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    activityIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityDetails: {
        flex: 1,
    },
    activityText: {
        ...Typography.body,
        fontSize: 13,
        color: Colors.textPrimary,
    },
    activityTime: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 2,
    },
    loadingText: {
        ...Typography.body,
        color: Colors.neutral,
        textAlign: 'center',
        marginVertical: Spacing.xl,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

