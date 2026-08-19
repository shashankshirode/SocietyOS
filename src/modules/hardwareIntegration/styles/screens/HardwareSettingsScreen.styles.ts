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
    form: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
    textContainer: { flex: 1, marginRight: Spacing.md },
    settingTitle: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    settingDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    label: { ...Typography.bodySmall, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.lg, marginBottom: Spacing.xs },
    selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md, backgroundColor: Colors.background, marginBottom: Spacing.xl },
    selectorText: { ...Typography.body, color: Colors.textPrimary },
    button: { height: 48, backgroundColor: Colors.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    buttonText: { ...Typography.button, color: '#FFFFFF' },
    viewWidth: { width: 24 }
});

