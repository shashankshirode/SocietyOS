import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    visual: { alignItems: 'center', justifyContent: 'center' },
});
export function createViewWidthHeightBorderRadiusBackgroundColorStyle(widthValue: number, heightValue: number, borderRadiusValue: number, backgroundColorValue: string) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue,
        backgroundColor: backgroundColorValue
    } as const;
}

