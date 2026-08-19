import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
    typeBadge: { ...Typography.caption, backgroundColor: Colors.infoLight, color: Colors.info, alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 4, marginBottom: Spacing.lg, fontWeight: '600' },
    label: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs, marginTop: Spacing.md },
    input: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.borderRadius.sm, padding: Spacing.sm, color: Colors.textPrimary, ...Typography.body },
    textArea: { height: 100, textAlignVertical: 'top' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
    sevBtn: { flex: 1, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card, alignItems: 'center', marginHorizontal: 2, borderRadius: Layout.borderRadius.sm },
    sevBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    sevText: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600' },
    sevTextActive: { color: '#fff' },
    consentRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
    checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: Colors.border, borderRadius: 4, marginRight: Spacing.sm },
    checked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    consentText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
    submitBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center' },
    submitBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' },
    textInputFlex: { flex: 0.4 },
    textInputFlex2: { flex: 0.55 }
});

