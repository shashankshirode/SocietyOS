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
    ownerCard: {
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
    ownerName: {
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
    reasonText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        marginTop: 2,
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
    docsText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 8,
        marginTop: 4,
        fontWeight: '600',
    },
});
