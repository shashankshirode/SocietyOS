import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    list: {
        gap: Spacing.lg,
    },
    card: {
        borderWidth: 1,
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },
    image: {
        height: 132,
    },
    content: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    title: {
        width: '70%',
        height: 22,
        borderRadius: 8,
    },
    line: {
        width: '88%',
        height: 14,
        borderRadius: 7,
    },
    badge: {
        width: 130,
        height: 28,
        borderRadius: 14,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: Radius.button,
    },
});
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

