import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Layout.screenHorizontalPadding },
    header: { marginBottom: Spacing.lg },
    title: { ...Typography.screenTitle, color: Colors.textPrimary },
    subtitle: { ...Typography.bodySmall, color: Colors.textSecondary },
    metricsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
    sectionTitle: { ...Typography.sectionTitle, color: Colors.textPrimary, marginBottom: Spacing.md },
    loading: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginVertical: Spacing.xl },
});
