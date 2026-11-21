import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { padding: Spacing.md, gap: Spacing.md },
    card: { backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, borderRadius: 8, padding: Spacing.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.xs },
    title: { ...Typography.body, color: Colors.textPrimary, fontWeight: '700', flex: 1 },
    subtitle: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 19 },
    metric: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginTop: Spacing.xs },
    success: { ...Typography.bodySmall, color: Colors.success, fontWeight: '700', textAlign: 'center' }
});
