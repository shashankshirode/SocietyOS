import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
import { Layout } from "../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
    headerTitle: { ...Typography.h3, color: Colors.textPrimary },
    content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
    label: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.xs },
    input: { backgroundColor: Colors.surface, borderRadius: Layout.borderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, ...Typography.body, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
    inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
    typeRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
    typeChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Layout.borderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
    typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    typeText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    typeTextActive: { color: Colors.white },
    submitBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Layout.borderRadius.lg, marginTop: Spacing.xl },
    submitBtnDisabled: { opacity: 0.6 },
    submitText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
    disclaimer: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.lg, lineHeight: 18 },
    viewWidth: { width: 24 }
});

