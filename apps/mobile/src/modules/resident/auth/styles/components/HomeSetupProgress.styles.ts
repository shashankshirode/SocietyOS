import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        gap: Spacing.xs,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
    },
    barBg: {
        height: 4,
        borderRadius: Radius.pill,
        width: '100%',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: Radius.pill,
    },
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        alignSelf: 'flex-end'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorWidthStyle(backgroundColorValue: string, widthValue: `${number}%`) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue
    } as const;
}

