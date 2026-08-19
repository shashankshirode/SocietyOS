import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.xs
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0
    },
    label: {
        ...Typography.bodySmall
    },
    valueContainer: {
        flex: 1,
        alignItems: 'flex-end',
        minWidth: 0
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderBottomColorStyle(borderBottomColorValue: string) {
    return {
        borderBottomWidth: 1,
        borderBottomColor: borderBottomColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

