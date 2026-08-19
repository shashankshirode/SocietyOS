import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    container: { padding: Spacing.md, gap: Spacing.md },
    card: { backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, padding: Spacing.md },
    title: { ...Typography.body, color: Colors.textPrimary, fontWeight: '700' },
    detail: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.xs },
    meta: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginTop: Spacing.xs },
    success: { ...Typography.bodySmall, color: Colors.success, fontWeight: '700', textAlign: 'center' },
});
