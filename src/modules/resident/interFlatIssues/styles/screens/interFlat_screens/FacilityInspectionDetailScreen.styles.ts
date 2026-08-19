import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { ...Typography.body, color: Colors.textSecondary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
    label: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.sm },
    value: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500', marginBottom: Spacing.xs },
});
