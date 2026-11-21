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
    mainContainer: {
        flex: 1,
    },
    banner: {
        marginHorizontal: Layout.screenHorizontalPadding,
        marginTop: Spacing.md,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    lockBox: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.dangerLight + '20',
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    lockIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dangerLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    lockTitle: {
        ...Typography.body,
        fontWeight: '800',
        color: Colors.danger,
    },
    lockSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.sm,
    },
    sectionHeader: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: Spacing.sm,
    },
    filesListContainer: {
        marginBottom: Spacing.lg,
    },
    lockedDocItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.xs,
        opacity: 0.6,
    },
    docNameMuted: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textMuted,
    },
    docCatMuted: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        marginTop: 2,
    },
    lockTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.border,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    lockTagText: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        fontWeight: '700',
    },
    actions: {
        marginTop: Spacing.xs,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    viewFlexMarginLeft: { flex: 1, marginLeft: Spacing.md }
});

