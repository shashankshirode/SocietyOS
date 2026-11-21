import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    headerBanner: {
        alignItems: 'center',
        backgroundColor: Colors.successLight,
        padding: Spacing.lg,
        borderRadius: Layout.borderRadius.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.successLight,
    },
    bannerTitle: {
        ...Typography.h3,
        fontWeight: '700',
        color: Colors.success,
        marginTop: Spacing.xs,
        marginBottom: 4,
    },
    bannerDesc: {
        ...Typography.caption,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 16,
    },
    guidelinesList: {
        gap: Spacing.md,
    },
    guidelineCard: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        gap: Spacing.md,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    guidelineContent: {
        flex: 1,
    },
    guidelineTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    guidelineText: {
        ...Typography.caption,
        color: Colors.neutral,
        lineHeight: 16,
    },
    viewBackgroundColor: { backgroundColor: Colors.infoLight },
    viewBackgroundColor2: { backgroundColor: Colors.warningLight },
    viewBackgroundColor3: { backgroundColor: Colors.primaryLight },
    viewBackgroundColor4: { backgroundColor: Colors.dangerLight }
});

