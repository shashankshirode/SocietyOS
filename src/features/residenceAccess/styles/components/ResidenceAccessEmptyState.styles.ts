import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
    },
    icon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        textAlign: 'center',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

