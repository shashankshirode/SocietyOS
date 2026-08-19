import { StyleSheet } from "react-native";
import { Radius } from "../../../../shared/theme/radius";
import { Spacing } from "../../../../shared/theme/spacing";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    badge: {
        maxWidth: 104,
        minHeight: 28,
        justifyContent: 'center',
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
    },
    label: {
        ...Typography.caption,
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center',
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

