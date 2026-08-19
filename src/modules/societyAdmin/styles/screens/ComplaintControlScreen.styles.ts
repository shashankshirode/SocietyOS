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
    filterSection: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.sm,
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
    ticketNum: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    category: {
        ...Typography.sectionTitle,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    unitText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    metaText: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    actionBtn: {
        marginTop: Spacing.xs,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
