import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        marginBottom: Spacing.xs,
    },
    message: {
        maxWidth: 300,
    },
    supportCode: {
        fontStyle: 'italic',
        marginTop: Spacing.xs,
    },
    button: {
        marginTop: Spacing.lg,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

