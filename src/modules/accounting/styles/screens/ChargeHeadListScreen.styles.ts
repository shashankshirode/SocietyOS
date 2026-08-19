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
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
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
    type: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    desc: {
        ...Typography.bodySmall,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    valueLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    value: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.primary,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
