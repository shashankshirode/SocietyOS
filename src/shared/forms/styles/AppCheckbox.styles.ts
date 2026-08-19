import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Radius } from "../../theme/radius";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        gap: Spacing.md,
    },
    disabled: {
        opacity: 0.5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: Radius.xs || 4,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        flex: 1,
        flexWrap: 'wrap',
        minWidth: 0,
    },
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

