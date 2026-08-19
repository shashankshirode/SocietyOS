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
    card: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
    label: { ...Typography.body, color: Colors.textSecondary },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
    viewWidth: { width: 24 }
});

