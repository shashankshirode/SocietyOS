import { StyleSheet } from "react-native";
import { Radius, Spacing } from "../../../shared/theme";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.xxxl,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: Radius.surface,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        marginBottom: Spacing.xs,
    },
    description: {
        maxWidth: 320,
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
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
