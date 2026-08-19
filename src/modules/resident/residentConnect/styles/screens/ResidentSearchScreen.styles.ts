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
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        marginHorizontal: Layout.screenHorizontalPadding,
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.md,
        height: 48,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        color: Colors.textPrimary,
        ...Typography.bodySmall,
    },
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    resultCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.xs,
        padding: Spacing.md,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primaryLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    details: {
        flex: 1,
    },
    nameText: {
        ...Typography.bodySmall,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    flatText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    rightCol: {
        alignItems: 'flex-end',
    },
    badge: {
        paddingVertical: 1,
        paddingHorizontal: 6,
    },
    helperBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxxl,
        paddingHorizontal: Spacing.xl,
    },
    helperTitle: {
        ...Typography.body,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginTop: Spacing.md,
    },
    helperText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
        marginTop: Spacing.sm,
    },
});
