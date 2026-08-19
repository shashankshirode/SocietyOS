import { StyleSheet } from "react-native";
import { Colors } from "../../../../../shared/constants/colors";
import { Layout } from "../../../../../shared/constants/layout";
import { Spacing } from "../../../../../shared/constants/spacing";
import { Typography } from "../../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    tenantCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    details: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    tenantName: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    periodText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    pvBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    pvLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
    },
    badgeInline: {
        paddingVertical: 1,
        paddingHorizontal: Spacing.sm,
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    badge: {
        alignSelf: 'flex-end',
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    revokedText: {
        ...Typography.caption,
        color: Colors.danger,
        fontSize: 8,
        marginTop: 4,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
