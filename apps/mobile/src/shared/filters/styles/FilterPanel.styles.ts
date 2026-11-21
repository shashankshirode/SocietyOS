import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    body: {
        paddingHorizontal: Spacing.lg
    },
    section: {
        marginBottom: Spacing.lg
    },
    sectionTitle: {
        ...Typography.caption,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm
    }
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

