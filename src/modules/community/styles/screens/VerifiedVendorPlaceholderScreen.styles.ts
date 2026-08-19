import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    listContent: {
        padding: Spacing.md,
    },
    headerBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.successLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.successLight,
    },
    bannerText: {
        ...Typography.caption,
        color: Colors.textPrimary,
        flex: 1,
        lineHeight: 16,
    },
    vendorCard: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.successLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vendorName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    vendorCategory: {
        ...Typography.caption,
        color: Colors.neutral,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
        marginTop: Spacing.md,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    verifiedText: {
        ...Typography.caption,
        fontSize: 10,
        fontWeight: '600',
        color: Colors.success,
    },
});
