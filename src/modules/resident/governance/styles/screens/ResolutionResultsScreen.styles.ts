import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    resTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
    barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
    barLabel: { ...Typography.bodySmall, fontWeight: '600', width: 55 },
    barTrack: { flex: 1, height: 14, backgroundColor: Colors.neutralLight, borderRadius: 7, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 7 },
    barValue: { ...Typography.caption, color: Colors.textSecondary, width: 65, textAlign: 'right' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.xs, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    label: { ...Typography.bodySmall, color: Colors.textTertiary },
    value: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '500' },
    voteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    voterName: { ...Typography.bodySmall, color: Colors.textPrimary },
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewWidthBackgroundColorStyle(widthValue: `${number}%`, backgroundColorValue: string) {
    return {
        width: widthValue,
        backgroundColor: backgroundColorValue
    } as const;
}

