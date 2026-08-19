import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 0,
        marginBottom: Spacing.md,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
    },
    tabletContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surfaceMuted,
        borderWidth: 1,
        borderColor: Colors.border,
        height: 36,
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        ...Typography.caption,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    chipTextActive: {
        color: Colors.white,
    },
    badge: {
        marginLeft: Spacing.xs,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: Radius.pill,
        backgroundColor: Colors.borderStrong,
    },
    badgeActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    badgeTextActive: {
        color: Colors.white,
    },
});
