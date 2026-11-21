import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.md },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: Spacing.xs },
    desc: { fontSize: 14, marginBottom: Spacing.md },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: Spacing.sm },
    actionText: { fontSize: 14, marginBottom: Spacing.sm },
    successBox: { padding: Spacing.sm, alignItems: 'center' },
    appCardMarginBottom: { marginBottom: Spacing.md },
    appCardMarginBottom2: { marginBottom: Spacing.md },
    appCardMarginBottom3: { marginBottom: Spacing.md }
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        marginBottom: Spacing.sm
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle6(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

