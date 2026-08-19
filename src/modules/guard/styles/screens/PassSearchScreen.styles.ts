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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    headerTitle: {
        ...Typography.screenTitle,
        color: Colors.textPrimary,
        fontSize: 22,
    },
    scanBoxCard: {
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        alignItems: "center",
        marginBottom: Spacing.xl,
    },
    scanFrame: {
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Spacing.lg,
        position: "relative",
    },
    cornerTL: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 24,
        height: 24,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: Colors.primary,
    },
    cornerTR: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 24,
        height: 24,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: Colors.primary,
    },
    cornerBL: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 24,
        height: 24,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: Colors.primary,
    },
    cornerBR: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: Colors.primary,
    },
    qrIcon: {
        opacity: 0.8,
    },
    scanInstructions: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.md,
        textAlign: "center",
    },
    simulateBtn: {
        marginTop: Spacing.xs,
    },
    searchSection: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    inputGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    textInput: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 48,
        color: Colors.textPrimary,
        ...Typography.bodySmall,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: 4,
    },
    orDivider: {
        ...Typography.caption,
        color: Colors.textMuted,
        fontWeight: "700",
        textAlign: "center",
        marginVertical: Spacing.sm,
    },
    searchBtn: {
        marginTop: Spacing.sm,
    },
    recentCard: {
        backgroundColor: Colors.surface,
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: Spacing.md,
        minHeight: Layout.minimumTouchTarget,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    recentItemDetails: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    recentName: {
        ...Typography.bodySmall,
        fontWeight: "600",
        color: Colors.textPrimary,
    },
    recentMeta: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    recentCode: {
        ...Typography.caption,
        fontWeight: "700",
        color: Colors.primary,
        marginRight: Spacing.sm,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    warningBannerMarginBottom: { marginBottom: Spacing.md },
    textInput2: {},
    textInput3: {}
});

