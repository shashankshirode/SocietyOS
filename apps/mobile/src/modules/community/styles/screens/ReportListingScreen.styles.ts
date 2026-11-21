import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Typography } from "../../../../shared/constants/typography";
import { Spacing } from "../../../../shared/constants/spacing";
export const styles = StyleSheet.create({
    scrollContent: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    headerText: {
        ...Typography.body,
        color: Colors.neutral,
        lineHeight: 20,
        marginBottom: Spacing.sm,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: Spacing.lg,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dangerLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    successEmoji: {
        fontSize: 40,
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
