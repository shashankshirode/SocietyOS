import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout as LayoutConst } from "../../../../shared/constants/layout";
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
        paddingHorizontal: LayoutConst.screenHorizontalPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    sectionTitle: {
        ...Typography.sectionTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        marginTop: Spacing.lg,
    },
    faqCard: {
        overflow: 'hidden',
    },
    faqItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    faqQuestion: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        flex: 1,
        marginRight: Spacing.md,
        fontSize: 14,
    },
    faqAnswerContainer: {
        backgroundColor: Colors.neutralLight,
        padding: Spacing.lg,
    },
    faqAnswer: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    contactCard: {
        marginBottom: Spacing.lg,
    },
    contactDescription: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
        lineHeight: 18,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.neutralLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        ...Typography.bodySmall,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    contactValue: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: 2,
    },
    pressed: {
        opacity: 0.7,
    },
    bottomSpacer: {
        height: Spacing.xxl,
    },
    scrollViewFlex: { flex: 1 },
    skeletonMarginBottomMarginTop: { marginBottom: Spacing.md, marginTop: Spacing.lg },
    skeletonMarginBottom: { marginBottom: Spacing.sm },
    skeletonMarginBottom2: { marginBottom: Spacing.sm },
    skeletonMarginBottom3: { marginBottom: Spacing.sm }
});

