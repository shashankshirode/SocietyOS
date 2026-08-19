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
    bannerMargin: {
        marginBottom: Spacing.lg,
    },
    profileCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.primaryLight + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    profileText: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    visitorName: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        fontSize: 18,
    },
    visitorType: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    detailsCard: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    instructionBox: {
        marginTop: Spacing.md,
        backgroundColor: Colors.neutralLight,
        padding: Spacing.md,
        borderRadius: Layout.borderRadius.md,
    },
    instructionLabel: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    instructionText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    actionsContainer: {
        marginTop: Spacing.md,
    },
    actionBtn: {
        marginBottom: Spacing.md,
        height: 52,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    viewFlex: { flex: 1 },
    viewFlex2: { flex: 1 },
    viewFlex3: { flex: 1 },
    viewFlex4: { flex: 1 }
});

