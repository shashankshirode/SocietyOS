import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    pill: {
        alignSelf: 'flex-start',
        borderRadius: Radius.pill,
        borderWidth: 1,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        maxWidth: '100%',
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

