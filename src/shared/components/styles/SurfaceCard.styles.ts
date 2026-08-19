import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    card: { borderRadius: Radius.card, borderWidth: 1, padding: Spacing.lg, gap: Spacing.md, minWidth: 0, overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, minWidth: 0 },
    copy: { flex: 1, minWidth: 0, gap: Spacing.xs },
    actionArea: { marginTop: Spacing.xs }
});
