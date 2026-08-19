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
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
    cardTitle: { ...Typography.body, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xs },
    cardDesc: { ...Typography.body, color: Colors.textPrimary, marginBottom: Spacing.sm },
    evidenceText: { ...Typography.caption, color: Colors.textSecondary, fontStyle: 'italic' }
});
