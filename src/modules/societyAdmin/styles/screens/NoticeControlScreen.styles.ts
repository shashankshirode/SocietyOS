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
    formContainer: {
        padding: Layout.screenHorizontalPadding,
        gap: Spacing.md
    },
    topActions: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md
    },
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingBottom: Spacing.xxl,
        gap: Spacing.md
    },
    card: {
        padding: Spacing.md
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs
    },
    category: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.primary
    },
    noticeTitle: {
        ...Typography.sectionTitle,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs
    },
    noticeContent: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.md
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm
    },
    metaText: {
        ...Typography.caption,
        color: Colors.textMuted
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.lg
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    appButtonFlex: { flex: 1 },
    appButtonFlex2: { flex: 1 },
    viewFlex: { flex: 1 }
});

