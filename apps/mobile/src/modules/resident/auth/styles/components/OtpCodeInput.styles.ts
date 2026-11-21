import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
    },
    slotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    slot: {
        width: 46,
        height: 56,
        borderWidth: 2,
        borderRadius: Radius.input,
        justifyContent: 'center',
        alignItems: 'center',
    },
    digit: {
        textAlign: 'center',
        fontWeight: '700',
    },
    cursor: {
        width: 2,
        height: 24,
        borderRadius: 1,
        opacity: 0.6,
    },
    hiddenInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        fontSize: 1,
    },
});
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

