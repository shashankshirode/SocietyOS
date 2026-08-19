import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.md },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
    title: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
    count: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xs },
    date: { ...Typography.caption, color: Colors.textSecondary }
});
