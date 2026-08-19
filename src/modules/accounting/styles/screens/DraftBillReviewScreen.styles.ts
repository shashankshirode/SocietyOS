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
    publishHeader: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderColor: Colors.border,
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
    owner: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    wing: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginBottom: Spacing.md,
    },
    chargesSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    chargeItem: {
        alignItems: 'center',
        flex: 1,
    },
    chargeLbl: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    chargeVal: {
        ...Typography.bodySmall,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: Spacing.xs,
    },
    warningBox: {
        backgroundColor: '#FEF2F2',
        borderRadius: Layout.borderRadius.sm,
        padding: Spacing.xs,
        marginTop: Spacing.sm,
    },
    warningText: {
        ...Typography.caption,
        color: Colors.danger,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textFontWeightColor: { fontWeight: '700', color: Colors.primary }
});

