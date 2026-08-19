import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
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
        paddingBottom: 120,
    },
    imageContainer: {
        height: 240,
        backgroundColor: Colors.borderLight,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.infoLight,
    },
    placeholderText: {
        ...Typography.caption,
        color: Colors.info,
        marginTop: Spacing.xs,
    },
    detailsContainer: {
        padding: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    title: {
        ...Typography.h3,
        fontWeight: '700',
        color: Colors.textPrimary,
        flex: 1,
    },
    price: {
        ...Typography.h2,
        fontWeight: '800',
        color: Colors.primary,
        marginVertical: Spacing.xs,
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
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 20,
    },
    sellerInfo: {
        flex: 1,
    },
    sellerName: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    sellerUnit: {
        ...Typography.caption,
        color: Colors.neutral,
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
