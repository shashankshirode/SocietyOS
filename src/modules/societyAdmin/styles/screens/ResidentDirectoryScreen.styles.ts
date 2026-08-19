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
    controls: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.sm,
        gap: Spacing.md,
        marginBottom: Spacing.sm,
    },
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingBottom: Spacing.xxl,
        gap: Spacing.md,
    },
    card: {
        padding: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    name: {
        ...Typography.sectionTitle,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    unitLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    detailsBox: {
        backgroundColor: Colors.background,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        gap: Spacing.xs,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLbl: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    detailVal: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
    },
    smallBadge: {
        paddingHorizontal: Spacing.xs,
        paddingVertical: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
