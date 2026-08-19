import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    electionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    electionMeta: { ...Typography.caption, color: Colors.textTertiary },
    electionDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
    dateRow: { gap: 4, marginBottom: Spacing.sm },
    dateText: { ...Typography.caption, color: Colors.textTertiary },
    conductor: { ...Typography.caption, color: Colors.textTertiary, fontStyle: 'italic', marginBottom: Spacing.md },
    positionCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.md },
    positionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, paddingBottom: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    positionTitle: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '600' },
    vacancies: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
    noCandidates: { ...Typography.caption, color: Colors.textTertiary, fontStyle: 'italic' },
    candidateRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    candidateAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
    candidateAvatarText: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '700' },
    candidateInfo: { flex: 1 },
    candidateName: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
    candidateUnit: { ...Typography.caption, color: Colors.textTertiary },
    manifesto: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic', lineHeight: 16 },
    candidateRight: { alignItems: 'flex-end', gap: 4 },
    voteCount: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
    resultSummary: { backgroundColor: Colors.successLight, padding: Spacing.md, borderRadius: 8, marginTop: Spacing.sm },
    resultText: { ...Typography.bodySmall, color: Colors.success, fontWeight: '500', textAlign: 'center' },
    emptyText: { ...Typography.body, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.xxl },
});
