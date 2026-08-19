import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
    },
    sectionHeader: {
        ...Typography.sectionTitle,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    card: {
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: Spacing.md,
    },
    flagLabel: {
        ...Typography.sectionTitle,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    flagDesc: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    saveBtn: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    textMarginTop: { marginTop: Spacing.xl }
});

