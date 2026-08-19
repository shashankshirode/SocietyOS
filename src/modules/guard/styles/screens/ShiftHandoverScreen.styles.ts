import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: Layout.screenHorizontalPadding,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl
    },
    bannerMargin: {
        marginBottom: Spacing.lg
    },
    card: {
        backgroundColor: Colors.surface,
        marginBottom: Spacing.lg
    },
    sectionTitle: {
        ...Typography.cardTitle,
        color: Colors.textPrimary,
        marginBottom: Spacing.md
    },
    inputGroup: {
        marginBottom: Spacing.md
    },
    label: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm
    },
    textInput: {
        backgroundColor: Colors.neutralLight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 48,
        color: Colors.textPrimary,
        ...Typography.bodySmall
    },
    notesInput: {
        backgroundColor: Colors.neutralLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        ...Typography.bodySmall,
        textAlignVertical: 'top',
        height: 80,
        borderWidth: 1,
        borderColor: Colors.border
    },
    inputError: {
        borderColor: Colors.danger
    },
    errorText: {
        ...Typography.caption,
        color: Colors.danger,
        marginTop: 4
    },
    submitBtn: {
        height: 52
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Layout.screenHorizontalPadding
    },
    successIconOuter: {
        marginBottom: Spacing.lg
    },
    successTitle: {
        ...Typography.screenTitle,
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: Spacing.sm
    },
    successSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md
    },
    doneBtn: {
        height: 50
    },
    bottomSpacer: {
        height: Spacing.xxl
    },
    textInput2: {},
    textInput3: {}
});

