import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        gap: Spacing.md,
    },
    optionWrapper: {
        width: '100%',
    },
    card: {
        borderWidth: 1.5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrapper: {
        flex: 1,
        gap: Spacing.xxs,
    },
    title: {
        ...Typography.cardTitle,
        fontWeight: '600',
    },
    subtitle: {
        ...Typography.bodySmall,
    },
    checkIcon: {
        marginLeft: Spacing.xs,
    },
    pressableOpacity: { opacity: 0.8 }
});
export function createAppCardBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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

