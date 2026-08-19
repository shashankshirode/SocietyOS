import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Layout.screenHorizontalPadding, paddingVertical: Spacing.md },
    backButton: { padding: Spacing.xs },
    title: { ...Typography.screenTitle, fontSize: 20, color: Colors.textPrimary },
    scroll: { padding: Layout.screenHorizontalPadding },
    form: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
    label: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.md },
    input: { height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md, ...Typography.body, color: Colors.textPrimary, backgroundColor: Colors.background },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.lg },
    checkboxLabel: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
    button: { height: 48, backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    buttonText: { ...Typography.button, color: '#FFFFFF' },
    viewWidth: { width: 24 }
});

