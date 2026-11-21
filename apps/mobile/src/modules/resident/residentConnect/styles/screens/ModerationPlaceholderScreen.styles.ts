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
    bannerMargin: {
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    reportId: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    targetLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        fontWeight: '700',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.borderLight,
        marginVertical: Spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    fieldLabel: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontWeight: '700',
        fontSize: 9,
        textTransform: 'uppercase',
    },
    fieldVal: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
    },
    descriptionBox: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.sm,
        marginTop: Spacing.md,
    },
    descriptionText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        lineHeight: 14,
        marginTop: 4,
    },
    contextBox: {
        backgroundColor: Colors.dangerLight + '05',
        borderWidth: 1,
        borderColor: Colors.dangerLight + '20',
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.sm,
        marginTop: Spacing.sm,
    },
    contextText: {
        ...Typography.caption,
        color: Colors.danger,
        fontStyle: 'italic',
        lineHeight: 14,
        marginTop: 4,
    },
    textColor: { color: Colors.danger }
});

