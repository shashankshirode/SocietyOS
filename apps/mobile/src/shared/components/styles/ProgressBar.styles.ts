import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});
export function createViewHeightBackgroundColorBorderRadiusStyle(heightValue: number, backgroundColorValue: string, borderRadiusValue: number) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue,
        borderRadius: borderRadiusValue
    } as const;
}
export function createViewWidthHeightBackgroundColorBorderRadiusStyle(widthValue: `${number}%`, heightValue: number, backgroundColorValue: string, borderRadiusValue: number) {
    return {
        width: widthValue,
        height: heightValue,
        backgroundColor: backgroundColorValue,
        borderRadius: borderRadiusValue
    } as const;
}

