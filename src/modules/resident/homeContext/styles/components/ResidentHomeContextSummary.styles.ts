import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    group: {
        marginBottom: Spacing.md,
    },
    societyTitle: {
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        paddingHorizontal: 2,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

