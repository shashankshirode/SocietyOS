import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
    typeChip: { backgroundColor: Colors.warningLight, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: 6 },
    typeText: { ...Typography.caption, color: Colors.warning, fontWeight: '700' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    label: { ...Typography.bodySmall, color: Colors.textTertiary },
    value: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '500', maxWidth: '55%', textAlign: 'right' },
    sectionTitle: { ...Typography.bodyLarge, color: Colors.textPrimary, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.sm },
    fullText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.md },
    voteBar: { height: 12, backgroundColor: Colors.neutralLight, borderRadius: 6, overflow: 'hidden', flexDirection: 'row', marginBottom: Spacing.sm },
    voteFill: { height: '100%' },
    voteLegend: { gap: Spacing.xs },
    voteText: { ...Typography.bodySmall, fontWeight: '600' },
    voteMeta: { ...Typography.caption, color: Colors.textTertiary, marginTop: Spacing.sm },
    textColor: { color: Colors.success },
    textColor2: { color: Colors.danger },
    textColor3: { color: Colors.neutral }
});
export function createViewWidthStyle(widthValue: `${number}%`) {
    return {
        width: widthValue,
        backgroundColor: Colors.success
    } as const;
}
export function createViewWidthStyle2(widthValue: `${number}%`) {
    return {
        width: widthValue,
        backgroundColor: Colors.danger
    } as const;
}
export function createViewWidthStyle3(widthValue: `${number}%`) {
    return {
        width: widthValue,
        backgroundColor: Colors.neutral
    } as const;
}

