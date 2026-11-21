import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextFontWeightStyle(fontWeightValue: "light" | "800" | "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "900" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "ultralight" | "thin" | "medium" | "regular" | "semibold" | "condensedBold" | "condensed" | "heavy" | "black") {
    return {
        fontWeight: fontWeightValue
    } as const;
}

