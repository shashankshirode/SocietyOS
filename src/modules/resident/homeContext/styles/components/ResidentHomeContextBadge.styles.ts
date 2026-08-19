import { StyleSheet } from "react-native";
import { Radius } from "../../../../../shared/theme/radius";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radius.pill,
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: '700',
        fontSize: 10,
        textTransform: 'uppercase',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

