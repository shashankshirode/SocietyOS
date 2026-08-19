import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.md, paddingBottom: Spacing.xxxl },
    card: { marginBottom: Spacing.md },
    headingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
    headingText: { flex: 1, gap: Spacing.xs },
    message: { marginTop: Spacing.md },
    sectionTitle: { marginBottom: Spacing.sm },
    helper: { marginBottom: Spacing.md },
    actionStack: { gap: Spacing.sm },
});
