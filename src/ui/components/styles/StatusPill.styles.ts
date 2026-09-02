import { StyleSheet } from "react-native";
import { Radius } from "../../../shared/theme/radius";
import { Spacing } from "../../../shared/theme/spacing";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.pill,
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    pillSmall: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radius.pill,
    },
    text: {
        ...Typography.tiny,
        textTransform: 'uppercase',
        flexShrink: 1,
    },
    textSmall: {
        lineHeight: 15,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
