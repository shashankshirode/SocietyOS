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
    memberCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    details: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    nameText: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    sosBadge: {
        backgroundColor: Colors.dangerLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sosText: {
        ...Typography.caption,
        color: Colors.danger,
        fontWeight: '800',
        fontSize: 8,
    },
    relationshipText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    phoneText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    noPhoneText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontStyle: 'italic',
        fontSize: 10,
        marginTop: 2,
    },
    dateText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        marginTop: 2,
    },
    badgesCol: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    badge: {
        alignSelf: 'flex-end',
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    statusBadgeMarginTop: { marginTop: 4 }
});

