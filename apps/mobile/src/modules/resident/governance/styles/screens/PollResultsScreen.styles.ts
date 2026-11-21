import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    typeText: { ...Typography.caption, color: Colors.textTertiary, fontWeight: '500' },
    title: { ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md },
    optionRow: { marginBottom: Spacing.lg },
    optionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    optionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flex: 1 },
    optionLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '500' },
    winnerLabel: { fontWeight: '700', color: Colors.primary },
    winnerIcon: { fontSize: 14 },
    optionValue: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
    barTrack: { height: 16, backgroundColor: Colors.neutralLight, borderRadius: 8, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 8 },
    winnerBar: { backgroundColor: Colors.success },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    statLabel: { ...Typography.bodySmall, color: Colors.textTertiary },
    statValue: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
});
export function createViewWidthStyle(widthValue: `${number}%`) {
    return {
        width: widthValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

