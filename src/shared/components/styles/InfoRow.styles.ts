import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
    },
    label: {
        ...Typography.bodySmall,
    },
    value: {
        ...Typography.bodySmall,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
        marginLeft: Spacing.lg,
    },
    italic: {
        fontStyle: 'italic',
    },
    textFontWeight: { fontWeight: '700' }
});
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
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

