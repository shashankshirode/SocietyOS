import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { ...Typography.body, color: Colors.textSecondary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500', marginBottom: Spacing.xs },
    section: { marginBottom: Spacing.lg },
    sectionTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
    noteCard: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
    noteAuthor: { ...Typography.body, fontWeight: '600', color: Colors.primary },
    noteText: { ...Typography.body, color: Colors.textPrimary, marginVertical: 4 },
    noteVis: { ...Typography.caption, color: Colors.textSecondary },
    emptyText: { ...Typography.body, color: Colors.textSecondary, fontStyle: 'italic' },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.xl },
    btn: { flex: 1, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center' },
    btnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    btnPrimaryText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
