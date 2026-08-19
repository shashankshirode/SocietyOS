import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        gap: Spacing.sm,
    },
    text: {
        ...Typography.caption,
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

