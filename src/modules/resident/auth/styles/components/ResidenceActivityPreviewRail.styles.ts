import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        height: 38,
        justifyContent: 'center',
    },
    railCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: 7,
        borderRadius: Radius.pill,
        borderWidth: 1,
        alignSelf: 'flex-start',
        maxWidth: 280,
    },
    text: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 12,
        flexShrink: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    animatedViewBackgroundColorBorderColor: {
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: "#10B981" | "#EF4444" | "#3B82F6") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

