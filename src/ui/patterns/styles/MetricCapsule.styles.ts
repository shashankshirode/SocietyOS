import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    capsule: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
        flex: 1,
        minWidth: 120,
    },
    capsuleBody: {
        flex: 1,
        minWidth: 0,
        gap: 1,
    },
    metricsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metricItem: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.18)',
    },
});
export function createAnimatedViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

