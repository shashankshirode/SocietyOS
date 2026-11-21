import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    list: { padding: Spacing.md },
    card: { borderRadius: 8, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
    flat: { fontSize: 16, fontWeight: 'bold' },
    name: { fontSize: 14, marginBottom: Spacing.sm },
    btn: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12 },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
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

