import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    button: {
        minHeight: 52,
        borderRadius: Radius.button,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    loadingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
});
export function createAppTextColorStyle(colorValue: "rgba(255, 255, 255, 0.35)" | "rgba(15, 23, 42, 0.35)" | "#ffffff") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: "#4F46E5" | "rgba(99, 102, 241, 0.12)" | "rgba(99, 102, 241, 0.06)") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

