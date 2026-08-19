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
    categoryText: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 4,
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
});
