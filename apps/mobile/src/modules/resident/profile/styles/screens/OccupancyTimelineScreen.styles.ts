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
    mainContainer: {
        flex: 1,
    },
    banner: {
        marginHorizontal: Layout.screenHorizontalPadding,
        marginTop: Spacing.md,
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    itemWrapper: {
        flexDirection: 'row',
        position: 'relative',
        minHeight: 100,
    },
    verticalLine: {
        position: 'absolute',
        left: 17,
        top: 36,
        bottom: -10,
        width: 2,
        backgroundColor: Colors.borderLight,
        zIndex: 1,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        marginRight: Spacing.md,
    },
    detailsContent: {
        flex: 1,
        paddingBottom: Spacing.md,
    },
    eventCard: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xs,
    },
    eventTitle: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    metaLine: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        marginTop: 2,
    },
    badge: {
        paddingVertical: 1,
        paddingHorizontal: 6,
    },
    descText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        lineHeight: 14,
        marginTop: 4,
    },
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

