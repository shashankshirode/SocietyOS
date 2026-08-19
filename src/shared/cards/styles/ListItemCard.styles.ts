import { StyleSheet, type ViewStyle } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.sm,
        width: '100%',
        borderWidth: 1,
        paddingVertical: Spacing.md
    },
    iconCircle: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm
    }
});
export function createViewBackgroundColorBorderRadiusStyle(backgroundColorValue: string, borderRadiusValue: 18) {
    return {
        backgroundColor: backgroundColorValue,
        borderRadius: borderRadiusValue
    } as const;
}
export function createAppCardShadowColorSpread2Style(shadowColorValue: string, spread2Value: ViewStyle) {
    return {
        shadowColor: shadowColorValue,
        ...spread2Value
    } as const;
}

