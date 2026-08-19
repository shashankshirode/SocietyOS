import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxxl,
    },
    metricGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    metricCard: {
        minWidth: '30%',
    },
    sectionHeader: {
        marginBottom: Spacing.sm,
    },
    securityCard: {
        marginTop: Spacing.lg,
    },
    securityTitle: {
        ...Typography.cardTitle,
        marginBottom: Spacing.xs,
    },
    securityText: {
        ...Typography.bodySmall,
        marginBottom: Spacing.lg,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

