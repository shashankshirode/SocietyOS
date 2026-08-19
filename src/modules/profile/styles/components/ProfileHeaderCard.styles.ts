import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    name: {
        ...Typography.sectionTitle,
    },
    subtitle: {
        ...Typography.bodySmall,
        marginTop: Spacing.xs,
    },
    meta: {
        ...Typography.caption,
        marginTop: 2,
    },
    badge: {
        marginTop: Spacing.sm,
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
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

