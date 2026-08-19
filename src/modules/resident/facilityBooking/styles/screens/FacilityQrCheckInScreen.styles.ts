import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    qrBox: { minHeight: 150, borderRadius: Layout.borderRadius.lg, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
    qrText: { ...Typography.sectionTitle, color: Colors.primary },
    qrSub: { ...Typography.bodySmall, color: Colors.textSecondary },
});
