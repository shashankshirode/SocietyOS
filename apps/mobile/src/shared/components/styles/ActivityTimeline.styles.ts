import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: { gap: Spacing.md },
    item: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, minWidth: 0 },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
    copy: { flex: 1, minWidth: 0, gap: Spacing.xs },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

