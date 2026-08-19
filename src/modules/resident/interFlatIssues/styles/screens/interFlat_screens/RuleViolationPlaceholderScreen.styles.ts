import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary },
    subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs },
    list: { padding: Spacing.md },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
    violNum: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary },
    status: { ...Typography.caption, color: Colors.warning, fontWeight: '600' },
    ruleTitle: { ...Typography.screenSubtitle, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.xs },
    desc: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.sm },
    amount: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600' }
});
