import { StyleSheet } from "react-native";
import { Spacing, Typography } from "../../../shared/theme";
export const styles = StyleSheet.create({
    content: {
        minHeight: 180,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
        padding: Spacing.xl,
    },
    message: {
        ...Typography.body,
        textAlign: 'center',
    },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

