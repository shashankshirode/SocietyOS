import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 100,
        padding: Spacing.md,
    },
    label: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    value: {
        ...Typography.screenTitle,
        fontSize: 24,
        fontWeight: '700',
    },
    subtext: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

