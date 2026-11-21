import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
    },
    formContainer: {
        padding: Layout.screenHorizontalPadding,
        gap: Spacing.md
    },
    sectionLbl: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs
    },
    recordBtn: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.xxl
    }
});
