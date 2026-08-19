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
    header: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.lg,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    headerTitle: {
        ...Typography.screenTitle,
        color: Colors.textPrimary,
        fontSize: 22,
    },
    searchContainer: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        backgroundColor: Colors.surface,
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    logCard: {
        marginBottom: Spacing.sm,
        backgroundColor: Colors.surface,
    },
    logRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: Layout.borderRadius.md,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    logContent: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    personName: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    logMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    logGuard: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    logRight: {
        alignItems: 'flex-end',
    },
    logTime: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    logStatus: {
        ...Typography.caption,
        fontWeight: '700',
        fontSize: 11,
        marginTop: 4,
    },
    inText: {
        color: Colors.success,
    },
    outText: {
        color: Colors.neutral,
    },
    statusBadge: {
        marginTop: 4,
    },
});
