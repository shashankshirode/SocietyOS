import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    stay: { borderWidth: 1, borderRadius: 12, padding: Spacing.md, gap: 4 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
    consent: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
    checkbox: { width: 22, height: 22, borderWidth: 2, borderRadius: 5 },
    consentText: { flex: 1 }
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}

