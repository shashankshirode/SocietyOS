import { StyleSheet } from "react-native";
import { Colors } from "../../../../../../shared/constants/colors";
import { Spacing } from "../../../../../../shared/constants/spacing";
import { Typography } from "../../../../../../shared/constants/typography";
import { Layout } from "../../../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.md },
    timelineItem: { flexDirection: 'row', marginBottom: Spacing.md },
    dotContainer: { alignItems: 'center', marginRight: Spacing.md },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, marginTop: 4 },
    line: { flex: 1, width: 2, backgroundColor: Colors.border, marginTop: 4 },
    content: { flex: 1, backgroundColor: Colors.card, padding: Spacing.md, borderRadius: Layout.borderRadius.sm, borderWidth: 1, borderColor: Colors.border },
    timestamp: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 2 },
    summary: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500' },
    role: { ...Typography.caption, color: Colors.primary, fontWeight: '600', marginTop: 4 }
});
