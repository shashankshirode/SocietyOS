import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Colors } from "../../../../shared/constants/colors";

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAF8F1' },
    content: { padding: Spacing.md, paddingBottom: 40 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: Spacing.xs, color: '#10201D' },
    desc: { fontSize: 13, marginBottom: Spacing.md, color: '#69716D' },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: Spacing.sm, color: '#10201D' },
    formCard: { marginBottom: Spacing.md, padding: Spacing.md, backgroundColor: '#FFFFFF', borderRadius: 16 },
    inputGroup: { marginBottom: 14 },
    label: { fontSize: 12.5, fontWeight: '600', color: '#10201D', marginBottom: 6 },
    input: { height: 46, borderWidth: 1, borderColor: '#E5E3DC', borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: '#10201D', backgroundColor: '#FFFFFF' },
    inputError: { borderColor: Colors.danger },
    errorText: { color: Colors.danger, fontSize: 11, marginTop: 4 },
    providerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    providerChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0EFE9', borderWidth: 1, borderColor: '#E5E3DC' },
    providerChipActive: { backgroundColor: '#064F45', borderColor: '#064F45' },
    providerText: { fontSize: 12.5, fontWeight: '600', color: '#69716D' },
    providerTextActive: { color: '#FFFFFF' },
    submitBtn: { marginTop: 12, backgroundColor: '#064F45' },
    successCard: { padding: Spacing.lg, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 20 },
    successTitle: { fontSize: 18, fontWeight: '700', color: '#10201D', marginTop: 12, marginBottom: 4 },
    successSubtitle: { fontSize: 13, color: '#69716D', textAlign: 'center', marginBottom: 16 },
    badgeBox: { backgroundColor: '#EBF4F2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16 },
    badgeText: { fontSize: 14, fontWeight: '700', color: '#064F45' },
    doneBtn: { minWidth: 200, backgroundColor: '#064F45' },
});
