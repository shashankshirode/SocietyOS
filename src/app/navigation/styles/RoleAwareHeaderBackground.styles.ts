import { StyleSheet } from "react-native";
import type { Absent } from "../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFill,
        overflow: 'hidden',
    },
    accentCircle: {
        position: 'absolute',
        right: -60,
        bottom: -60,
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.35,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string | Absent) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
