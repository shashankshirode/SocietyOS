import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Shadows } from "../../theme/shadows";
export const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.card,
        borderWidth: 1,
        padding: Spacing.lg,
        ...Shadows.card,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "rgba(30, 41, 59, 0.7)" | "rgba(255, 255, 255, 0.7)", borderColorValue: "rgba(255, 255, 255, 0.1)" | "rgba(255, 255, 255, 0.5)") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

