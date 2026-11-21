import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.md, gap: Spacing.md },
    card: { marginBottom: Spacing.sm },
    metrics: { flexDirection: 'row', gap: Spacing.sm },
    metricCard: { flex: 1, alignItems: 'center' },
    metric: { fontSize: 24, fontWeight: '900' },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
    title: { fontSize: 16, fontWeight: '800', flex: 1 },
    copy: { fontSize: 13, lineHeight: 19, textTransform: 'capitalize' },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
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

