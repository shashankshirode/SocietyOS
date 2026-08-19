import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
    },
    searchContainer: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl
    },
    staffCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        marginRight: Spacing.md
    },
    profileText: {
        maxWidth: 160
    },
    staffName: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary
    },
    staffType: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2
    },
    flatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: Spacing.sm
    },
    flatsText: {
        ...Typography.caption,
        color: Colors.textSecondary
    },
    bannerMargin: {
        marginBottom: Spacing.md
    },
    checkInTimeText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontStyle: 'italic',
        marginBottom: Spacing.md
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.md
    },
    overrideBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        paddingHorizontal: Spacing.md,
        height: 32,
        gap: Spacing.sm
    },
    overrideBtnActive: {
        borderColor: Colors.success,
        backgroundColor: Colors.successLight + '10'
    },
    overrideBtnText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600'
    },
    overrideBtnTextActive: {
        color: Colors.success
    },
    actionBtn: {
        paddingHorizontal: Spacing.xl,
        height: 36,
        borderRadius: Layout.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkInBtn: {
        backgroundColor: Colors.primary
    },
    checkOutBtn: {
        backgroundColor: Colors.neutral
    },
    disabledBtn: {
        backgroundColor: Colors.border,
        opacity: 0.5
    },
    actionBtnText: {
        ...Typography.caption,
        color: Colors.textOnPrimary,
        fontWeight: '700'
    },
    bottomSpacer: {
        height: Spacing.xxl
    },
    viewFlex: { flex: 1 },
    pressable: {}
});

