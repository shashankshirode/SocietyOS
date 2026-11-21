import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        marginBottom: Spacing.sm,
    },
    message: {
        marginBottom: Spacing.xl,
        maxWidth: 320,
    },
    actions: {
        width: '100%',
        gap: Spacing.sm,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

