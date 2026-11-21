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
    listContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    vehicleCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: Colors.primaryLight + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    details: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    vehicleNo: {
        ...Typography.bodySmall,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    driverLine: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },
    slotLine: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 10,
        marginTop: 2,
    },
    entryLine: {
        ...Typography.caption,
        color: Colors.success,
        fontSize: 9,
        fontWeight: '700',
        marginTop: 4,
    },
    entryLineMuted: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontSize: 9,
        fontStyle: 'italic',
        marginTop: 4,
    },
    badgesCol: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    badge: {
        alignSelf: 'flex-end',
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    statusBadgeMarginTop: { marginTop: 4 }
});

