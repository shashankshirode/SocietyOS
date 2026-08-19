import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: { width: '100%', gap: Spacing.md },
    header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.md, minWidth: 0 },
    copy: { flex: 1, minWidth: 0, gap: Spacing.xs },
    action: { flexShrink: 0, maxWidth: '45%' },
});
