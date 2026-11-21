import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    container: { padding: Spacing.md, gap: Spacing.md },
    input: { minHeight: 110, backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, padding: Spacing.md, textAlignVertical: 'top', ...Typography.body, color: Colors.textPrimary },
    card: { backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, padding: Spacing.md },
    title: { ...Typography.body, color: Colors.textPrimary, fontWeight: '700' },
    body: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.xs, lineHeight: 19 },
    meta: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginTop: Spacing.sm },
    note: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.xs },
    error: { ...Typography.caption, color: Colors.danger, fontWeight: '700' },
});
