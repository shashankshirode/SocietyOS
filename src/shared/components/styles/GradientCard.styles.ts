import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Shadows } from "../../theme/shadows";
export const styles = StyleSheet.create({
    card: {
        borderRadius: Radius.card,
        padding: Spacing.xl,
        overflow: 'hidden',
        position: 'relative',
        ...Shadows.medium,
    },
    topSheen: {
        position: 'absolute',
        height: 72,
        left: 0,
        right: 0,
        top: 0,
        opacity: 0.18,
    },
    bottomSheen: {
        position: 'absolute',
        height: 44,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.12,
    },
    content: {
        zIndex: 2,
    },
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

