import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.lg },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500', marginBottom: Spacing.xs },
    input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.borderRadius.sm, padding: Spacing.sm, color: Colors.textPrimary, ...Typography.body, marginBottom: Spacing.md },
    textArea: { height: 80, textAlignVertical: 'top' },
    decisionText: { ...Typography.bodySmall, fontWeight: '600', marginTop: Spacing.md },
    acceptedText: { color: Colors.success },
    rejectedText: { color: Colors.danger },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: Spacing.xl },
    btn: { flex: 0.48, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, alignItems: 'center' },
    btnReject: { borderWidth: 1, borderColor: Colors.danger, backgroundColor: Colors.background },
    btnRejectText: { ...Typography.body, color: Colors.danger, fontWeight: '600' },
    btnAccept: { backgroundColor: Colors.success },
    btnAcceptText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
