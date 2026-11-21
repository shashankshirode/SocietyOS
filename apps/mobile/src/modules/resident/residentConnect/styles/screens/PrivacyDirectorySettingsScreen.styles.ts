import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.md, gap: Spacing.md },
    card: { marginBottom: Spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    textBlock: { flex: 1 },
    title: { fontSize: 16, fontWeight: '800' },
    copy: { fontSize: 13, lineHeight: 19 },
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

