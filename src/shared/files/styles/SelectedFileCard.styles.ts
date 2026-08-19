import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
        gap: Spacing.md,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    details: {
        flex: 1,
        minWidth: 0,
    },
    name: {
        ...Typography.bodySmall,
        fontWeight: '600',
    },
    subtitle: {
        ...Typography.caption,
        marginTop: 2,
    },
    removeBtn: {
        padding: 4,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
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

