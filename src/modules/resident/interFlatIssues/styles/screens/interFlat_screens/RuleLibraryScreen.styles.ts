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
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    ruleNum: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
    badge: { ...Typography.caption, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 4, fontWeight: '600' },
    badgeReq: { backgroundColor: Colors.warningLight, color: Colors.warning },
    badgeOpt: { backgroundColor: Colors.neutralLight, color: Colors.textSecondary },
    ruleTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
    ruleSummary: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.sm },
    version: { ...Typography.caption, color: Colors.textSecondary },
    footer: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
    btn: { flex: 0.48, backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, alignItems: 'center' },
    btnText: { ...Typography.body, color: '#fff', fontWeight: '600' },
    btnOutline: { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.primary },
    btnOutlineText: { ...Typography.body, color: Colors.primary, fontWeight: '600' }
});
