import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    message: {
        marginTop: Spacing.md,
        maxWidth: 280,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

