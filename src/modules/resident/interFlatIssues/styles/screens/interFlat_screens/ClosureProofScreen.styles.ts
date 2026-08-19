import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
    subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.lg },
    label: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs },
    input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.borderRadius.sm, padding: Spacing.sm, color: Colors.textPrimary, ...Typography.body, marginBottom: Spacing.lg },
    textArea: { height: 100, textAlignVertical: 'top' },
    uploadPlaceholder: { height: 120, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card, borderRadius: Layout.borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
    uploadText: { ...Typography.body, color: Colors.primary, fontWeight: '600' },
    uploadSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
    submitBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center' },
    submitBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
