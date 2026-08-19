import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { gap: Spacing.md, paddingTop: Spacing.lg },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    copy: { flex: 1, minWidth: 0, gap: Spacing.xs },
});
