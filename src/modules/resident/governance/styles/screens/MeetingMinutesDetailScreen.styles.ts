import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    summary: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
    metaRow: { flexDirection: 'row', gap: Spacing.lg, flexWrap: 'wrap' },
    metaText: { ...Typography.caption, color: Colors.textTertiary },
    approvedText: { ...Typography.caption, color: Colors.success, marginTop: Spacing.sm, fontWeight: '500' },
    decisionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
    bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 6 },
    decisionText: { ...Typography.bodySmall, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
    actionRow: { paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
    actionDesc: { ...Typography.bodySmall, color: Colors.textPrimary, flex: 1 },
    actionMeta: { ...Typography.caption, color: Colors.textTertiary, marginTop: 4 },
    attGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    attCell: { alignItems: 'center' },
    attNum: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '700' },
    attLabel: { ...Typography.caption, color: Colors.textTertiary },
    acknowledgedText: { ...Typography.bodySmall, color: Colors.success, textAlign: 'center', marginTop: Spacing.lg, fontWeight: '500' },
    acknowledgmentPanel: { gap: Spacing.md, marginTop: Spacing.lg },
    pendingText: { ...Typography.bodySmall, color: Colors.warning, textAlign: 'center', fontWeight: '500' },
    statusBadgeAlignSelfMarginTop: { alignSelf: 'center', marginTop: Spacing.sm },
    textColor: { color: Colors.success },
    textColor2: { color: Colors.danger },
    textColor3: { color: Colors.info }
});

