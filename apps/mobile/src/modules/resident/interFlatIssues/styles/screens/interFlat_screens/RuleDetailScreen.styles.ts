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
    header: { marginBottom: Spacing.md },
    ruleNum: { ...Typography.caption, color: Colors.primary, fontWeight: '700', textTransform: 'uppercase' },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
    sectionTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
    detailText: { ...Typography.body, color: Colors.textPrimary, lineHeight: 22 },
    section: { marginTop: Spacing.lg },
    exampleText: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xs },
    penaltyCard: { backgroundColor: Colors.dangerLight, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, marginTop: Spacing.lg, borderLeftWidth: 3, borderLeftColor: Colors.danger },
    penaltyTitle: { ...Typography.body, fontWeight: '700', color: Colors.danger, marginBottom: Spacing.xs },
    penaltyText: { ...Typography.body, color: Colors.danger },
    actionBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xl },
    actionBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
