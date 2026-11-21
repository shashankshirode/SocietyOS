import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    tile: {
        minHeight: 66,
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    icon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        flex: 1,
        gap: 2,
    },
});
export function createPressableBorderColorBackgroundColorOpacityStyle(borderColorValue: string, backgroundColorValue: string, opacityValue: 1 | 0.45) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        opacity: opacityValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

