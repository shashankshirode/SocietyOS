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
    controls: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.sm,
        gap: Spacing.md,
        marginBottom: Spacing.sm,
    },
    list: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingBottom: Spacing.xxl,
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
    wingLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    detailLbl: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    detailVal: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textColorFontWeight: { color: Colors.danger, fontWeight: '700' }
});

