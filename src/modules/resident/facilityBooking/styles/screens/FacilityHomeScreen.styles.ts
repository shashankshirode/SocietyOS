import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.md },
    text: { ...Typography.bodySmall, color: Colors.textSecondary, marginBottom: Spacing.sm },
});
