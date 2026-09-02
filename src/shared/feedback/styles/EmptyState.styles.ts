import { StyleSheet } from "react-native";
import { Radius, Spacing } from "../../theme";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxxl,
        paddingHorizontal: Spacing.xl,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: Radius.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        marginBottom: Spacing.sm,
    },
    description: {
        marginBottom: Spacing.xl,
        maxWidth: 280,
    },
    buttonRow: {
        justifyContent: 'center',
        gap: Spacing.sm,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
