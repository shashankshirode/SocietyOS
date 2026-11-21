import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    name: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    percentage: {
        ...Typography.body,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
    },
    label: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    value: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

