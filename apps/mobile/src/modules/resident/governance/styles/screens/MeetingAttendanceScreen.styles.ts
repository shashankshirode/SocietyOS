import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    summary: { marginBottom: Spacing.lg },
    quorumBar: { height: 10, backgroundColor: Colors.neutralLight, borderRadius: 5, overflow: 'hidden', marginBottom: Spacing.sm },
    quorumFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 5 },
    quorumText: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600', marginBottom: Spacing.sm },
    counters: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    counterDot: { width: 8, height: 8, borderRadius: 4 },
    counterText: { ...Typography.caption, color: Colors.textSecondary, marginRight: Spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
    avatarText: { ...Typography.body, color: Colors.primary, fontWeight: '700' },
    info: { flex: 1 },
    name: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
    unit: { ...Typography.caption, color: Colors.textTertiary },
    proxy: { ...Typography.caption, color: Colors.info, marginTop: 2 },
    emptyText: { ...Typography.body, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.xxl },
    viewBackgroundColor: { backgroundColor: Colors.success },
    viewBackgroundColor2: { backgroundColor: Colors.info },
    viewBackgroundColor3: { backgroundColor: Colors.danger }
});
export function createViewWidthStyle(widthValue: `${number}%`) {
    return {
        width: widthValue
    } as const;
}

