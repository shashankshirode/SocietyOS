import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    qrBox: {
        minHeight: 140,
        borderRadius: Layout.borderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    qrText: {
        ...Typography.sectionTitle,
        color: Colors.primary,
    },
    qrSub: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    instruction: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
});
