import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    row: {
        minHeight: 56,
        paddingVertical: Spacing.sm,
        width: '100%'
    },
    pressed: {
        opacity: 0.75
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.xs
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

