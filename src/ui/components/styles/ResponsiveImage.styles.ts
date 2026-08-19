import { StyleSheet, type DimensionValue } from "react-native";
import { Radius } from "../../../shared/theme/radius";
import type { Absent } from "../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    fallbackContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 16 / 9,
        width: '100%',
        borderRadius: Radius.card,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string | Absent) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewWidthAspectRatioStyle(widthValue: DimensionValue, aspectRatioValue: number) {
    return {
        width: widthValue,
        aspectRatio: aspectRatioValue
    } as const;
}
