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
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.xs,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.dangerLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    details: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    nameText: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    flatText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    reasonText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        fontStyle: 'italic',
        marginTop: 4,
    },
    unblockBtn: {
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: 6,
    },
    unblockText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '700',
    },
});
