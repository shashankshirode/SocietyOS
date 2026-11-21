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
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    card: {
        padding: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    unitNum: {
        ...Typography.sectionTitle,
        fontSize: 18,
        color: Colors.textPrimary,
    },
    resident: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    wing: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    duesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    duesLbl: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    duesVal: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.danger,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: Colors.border,
        paddingTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    metaText: {
        ...Typography.caption,
        color: Colors.textMuted,
    },
    reminderBtn: {
        marginTop: Spacing.xs,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
