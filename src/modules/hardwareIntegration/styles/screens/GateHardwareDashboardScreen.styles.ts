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
    scroll: { padding: Layout.screenHorizontalPadding },
    loading: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
    menu: { backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
    menuTextContainer: { flex: 1, marginLeft: Spacing.md },
    menuTitle: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    menuDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    viewWidth: { width: 24 }
});

