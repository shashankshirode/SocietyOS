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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    issueNum: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary },
    typeText: { ...Typography.screenSubtitle, fontWeight: '600', color: Colors.primary, marginBottom: Spacing.md },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500', marginBottom: Spacing.xs },
    section: { marginBottom: Spacing.lg },
    sectionTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
    responseCard: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderLeftWidth: 3, borderLeftColor: Colors.primary, marginBottom: Spacing.sm },
    respHeader: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    respType: { ...Typography.caption, color: Colors.primary, fontWeight: '600', marginVertical: 2 },
    respText: { ...Typography.body, color: Colors.textSecondary },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
    btn: { flex: 0.48, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, alignItems: 'center' },
    btnOutline: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.background },
    btnOutlineText: { ...Typography.body, color: Colors.primary, fontWeight: '600' },
    btnPrimary: { backgroundColor: Colors.primary },
    btnText: { ...Typography.body, color: '#fff', fontWeight: '600' },
    actionSection: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.lg, marginBottom: Spacing.xl },
    escalateBtn: { backgroundColor: Colors.danger, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center' },
    escalateBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
