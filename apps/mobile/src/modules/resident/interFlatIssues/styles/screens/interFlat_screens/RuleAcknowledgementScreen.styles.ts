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
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
    value: { ...Typography.body, color: Colors.textPrimary, lineHeight: 20 },
    consentRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
    checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, marginRight: Spacing.sm },
    checked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    consentText: { ...Typography.body, color: Colors.textPrimary, flex: 1 },
    submitBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center' },
    submitBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
