import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Radius } from "../../../shared/theme/radius";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    overlay: {
        minHeight: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        padding: Spacing['3xl'],
        borderRadius: Radius.lg,
        alignItems: 'center',
        minWidth: 180,
        gap: Spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    message: {
        ...Typography.body,
        textAlign: 'center',
    },
});
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

