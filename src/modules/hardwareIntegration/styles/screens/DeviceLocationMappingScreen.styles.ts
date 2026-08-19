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
    card: { marginBottom: Spacing.md },
    deviceName: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.xs },
    text: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: 2 },
    viewWidth: { width: 24 }
});

