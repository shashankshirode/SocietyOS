import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    scrollContent: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    receiverCard: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        gap: 2,
    },
    receiverLabel: {
        ...Typography.caption,
        color: Colors.neutral,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    targetTitle: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    receiverText: {
        ...Typography.caption,
        color: Colors.neutral,
        marginTop: 4,
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    urgencyRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    urgencyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Layout.borderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.card,
        flex: 1,
        justifyContent: 'center',
    },
    urgencyText: {
        ...Typography.caption,
        color: Colors.textPrimary,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    successIconCircle: {
        marginBottom: Spacing.lg,
    },
    successTitle: {
        ...Typography.h2,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    successDescription: {
        ...Typography.body,
        color: Colors.neutral,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.md,
    },
    successButtonContainer: {
        marginTop: Spacing.xl * 1.5,
        width: '100%',
    },
    errorText: { ...Typography.caption, color: Colors.danger, textAlign: 'center' },
});
export function createPressableBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}

