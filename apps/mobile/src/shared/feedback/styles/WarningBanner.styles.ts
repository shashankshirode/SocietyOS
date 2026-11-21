import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        padding: Spacing.md,
        borderRadius: Radius.md,
        gap: Spacing.sm,
        minWidth: 0,
    },
    icon: {
        marginTop: 1,
    },
    text: {
        lineHeight: 18,
        flex: 1,
        minWidth: 0,
        fontWeight: '500',
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

