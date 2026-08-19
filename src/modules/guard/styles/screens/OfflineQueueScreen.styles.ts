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
    content: {
        flex: 1
    },
    banner: {
        marginHorizontal: Layout.screenHorizontalPadding,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xxl
    },
    queueCard: {
        marginBottom: Spacing.md,
        backgroundColor: Colors.surface
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    details: {
        flex: 1,
        marginRight: Spacing.md
    },
    name: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary
    },
    meta: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: 4,
        fontWeight: '600'
    },
    actions: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.md
    },
    bottomSpacer: {
        height: Spacing.xxl
    },
    viewFlex: { flex: 1 },
    viewFlexMarginLeft: { flex: 1, marginLeft: Spacing.sm }
});

