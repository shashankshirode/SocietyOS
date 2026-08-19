import { StyleSheet } from "react-native";
import type { Absent } from "../../../../shared/types/absence.types";
export const styles = StyleSheet.create({
    background: {
        overflow: 'hidden',
    },
    endLayer: {
        ...StyleSheet.absoluteFillObject,
        left: '42%',
        opacity: 0.82,
    },
    accentLayer: {
        position: 'absolute',
        right: -48,
        top: -40,
        width: 156,
        height: 156,
        borderRadius: 78,
        opacity: 0.16,
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string | Absent) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

