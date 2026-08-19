import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 150,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        flex: 1,
        marginRight: Spacing.xs,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primaryLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        ...Typography.largeAmount,
        fontSize: 24,
        color: Colors.textPrimary,
        marginVertical: Spacing.xs,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: Spacing.xs,
    },
    trendText: {
        ...Typography.caption,
        fontWeight: '600',
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

