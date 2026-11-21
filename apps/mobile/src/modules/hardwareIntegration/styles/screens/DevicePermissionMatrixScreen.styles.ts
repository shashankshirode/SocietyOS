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
    matrix: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
    matrixTitle: { ...Typography.sectionTitle, color: Colors.textPrimary, marginBottom: Spacing.md },
    row: { paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
    permName: { ...Typography.body, fontWeight: '600', color: Colors.textPrimary },
    roles: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
    viewWidth: { width: 24 }
});

