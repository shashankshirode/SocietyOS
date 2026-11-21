import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.md },
    card: { backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    issueNum: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary },
    typeText: { ...Typography.screenSubtitle, fontWeight: '600', color: Colors.primary, marginBottom: Spacing.xs },
    desc: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.md },
    footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
    flatText: { ...Typography.caption, color: Colors.textSecondary },
    date: { ...Typography.caption, color: Colors.textSecondary },
    empty: { padding: Spacing.xl, alignItems: 'center' },
    emptyText: { ...Typography.body, color: Colors.textSecondary }
});
