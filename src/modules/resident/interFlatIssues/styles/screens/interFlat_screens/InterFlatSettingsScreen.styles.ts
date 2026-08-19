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
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
    actionBtn: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.md, alignItems: 'center' },
    actionBtnText: { ...Typography.body, color: '#fff', fontWeight: '600' }
});
