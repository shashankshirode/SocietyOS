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
        marginBottom: Spacing.xs,
    },
    actor: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    date: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    eventType: {
        ...Typography.sectionTitle,
        fontSize: 14,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    summary: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    ip: {
        ...Typography.caption,
        fontSize: 10,
        color: Colors.textMuted,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
