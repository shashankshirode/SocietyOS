import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    stack: { gap: 14 },
    hero: { height: 184, borderRadius: 20 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { height: 36, borderRadius: 18 },
    row: { height: 82, borderRadius: 16 },
});
export function createViewBackgroundColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewWidthBackgroundColorStyle(widthValue: number, backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        width: widthValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

