import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Layout.screenHorizontalPadding, paddingVertical: Spacing.md },
    backButton: { padding: Spacing.xs },
    title: { ...Typography.screenTitle, fontSize: 20, color: Colors.textPrimary },
    list: { padding: Layout.screenHorizontalPadding },
    loading: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
    empty: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
    left: { flex: 1 },
    plate: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    confidence: { ...Typography.bodySmall, color: Colors.textSecondary, marginVertical: 2 },
    time: { ...Typography.caption, color: Colors.textMuted },
    right: { alignItems: 'flex-end', justifyContent: 'center' },
    actionLink: { ...Typography.caption, color: Colors.primary, marginTop: Spacing.xs, fontWeight: '600' },
    viewWidth: { width: 24 }
});

