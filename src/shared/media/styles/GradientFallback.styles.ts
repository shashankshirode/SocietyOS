import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import type { Absent } from "../../types/absence.types";
export const styles = StyleSheet.create({
    container: { borderRadius: Radius.card, overflow: 'hidden' },
    layerOne: { ...StyleSheet.absoluteFill, opacity: 0.55, transform: [{ translateX: 80 }, { translateY: -40 }] },
    layerTwo: { ...StyleSheet.absoluteFill, opacity: 0.32, transform: [{ translateX: -90 }, { translateY: 70 }] },
    content: { flex: 1 },
});
export function createViewHeightBackgroundColorStyle(heightValue: number, backgroundColorValue: string | Absent) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string | Absent) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string | Absent) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

