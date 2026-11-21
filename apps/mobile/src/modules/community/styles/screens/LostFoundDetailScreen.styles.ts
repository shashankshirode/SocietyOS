import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        color: Colors.neutral,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 120,
    },
    contentCard: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },
    title: {
        ...Typography.h3,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    infoGrid: {
        gap: Spacing.sm,
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    descriptionText: {
        ...Typography.body,
        color: Colors.textPrimary,
        lineHeight: 20,
    },
    resolvedCard: {
        flexDirection: 'row',
        backgroundColor: Colors.successLight,
        borderWidth: 1,
        borderColor: Colors.successLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    resolvedInfo: {
        flex: 1,
    },
    resolvedTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.success,
    },
    resolvedText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        marginTop: 2,
    },
    resolvedNote: {
        ...Typography.caption,
        color: Colors.neutral,
        fontStyle: 'italic',
        marginTop: 4,
    },
    claimForm: {
        marginTop: Spacing.md,
        backgroundColor: Colors.neutralLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        gap: Spacing.md,
    },
    claimFormButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        backgroundColor: '#FFF',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        padding: Spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    flexButton: {
        flex: 1,
    },
    errorText: { ...Typography.caption, color: Colors.danger, textAlign: 'center' },
});
