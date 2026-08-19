import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: { flex: 1, minWidth: 146 },
    card: { minHeight: 118 },
    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.md },
    copy: { flex: 1 },
    value: { fontSize: 24, fontWeight: '900' },
    label: { fontSize: 12, fontWeight: '800', marginTop: Spacing.xs },
    detail: { fontSize: 11, lineHeight: 16, marginTop: Spacing.xs },
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

