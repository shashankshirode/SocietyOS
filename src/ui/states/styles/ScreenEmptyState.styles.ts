import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        marginBottom: Spacing.xs,
    },
    description: {
        maxWidth: 300,
    },
    action: {
        marginTop: Spacing.lg,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

