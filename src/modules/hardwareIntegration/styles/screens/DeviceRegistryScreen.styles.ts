import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Layout.screenHorizontalPadding, paddingVertical: Spacing.md },
    backButton: { padding: Spacing.xs },
    addButton: { padding: Spacing.xs },
    title: { ...Typography.screenTitle, fontSize: 20, color: Colors.textPrimary },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: Layout.screenHorizontalPadding, paddingHorizontal: Spacing.md, borderRadius: 8, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
    searchIcon: { marginRight: Spacing.sm },
    searchInput: { flex: 1, height: 44, ...Typography.body, color: Colors.textPrimary },
    list: { paddingHorizontal: Layout.screenHorizontalPadding, paddingBottom: Spacing.xl },
    loading: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
    empty: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
});
