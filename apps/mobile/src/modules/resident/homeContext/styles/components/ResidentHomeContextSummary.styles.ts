import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    societyTitle: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.75,
        marginBottom: Spacing.sm,
        paddingHorizontal: 2,
    },
    otherHomesStart: { marginTop: Spacing.lg },
    otherHomesLabel: { letterSpacing: 0.75, marginBottom: Spacing.sm, paddingHorizontal: 2 },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
