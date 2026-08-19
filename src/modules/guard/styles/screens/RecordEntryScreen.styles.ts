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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    cardSectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    photoContainer: {
        height: 120,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        borderRadius: Layout.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.neutralLight,
        padding: Spacing.md,
    },
    photoText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    photoSubtext: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    notesInput: {
        backgroundColor: Colors.neutralLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        ...Typography.bodySmall,
        textAlignVertical: 'top',
        height: 80,
    },
    confirmBtn: {
        marginTop: Spacing.sm,
        height: 52,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Layout.screenHorizontalPadding,
    },
    successIconOuter: {
        marginBottom: Spacing.lg,
    },
    successTitle: {
        ...Typography.screenTitle,
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    successSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        marginBottom: Spacing.xl,
    },
    summaryTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    doneBtn: {
        height: 50,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
});
