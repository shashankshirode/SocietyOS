import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.md },
    title: { ...Typography.screenTitle, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
    ruleTitle: { ...Typography.screenSubtitle, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.lg },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
    statBox: { flex: 1, backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', marginHorizontal: 4 },
    statNum: { ...Typography.screenTitle, color: Colors.primary, fontWeight: '700' },
    statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    sectionTitle: { ...Typography.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
    userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
    userName: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    userFlat: { ...Typography.caption, color: Colors.textSecondary },
    statusText: { ...Typography.caption, fontWeight: '600', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 4 },
    statusAck: { backgroundColor: Colors.successLight, color: Colors.success },
    statusPen: { backgroundColor: Colors.warningLight, color: Colors.warning }
});
