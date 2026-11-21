import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    outer: {
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    inner: {
        width: '82%',
        height: '82%',
        borderRadius: 999,
    },
});
export function createPressableWidthHeightBorderRadiusStyle(widthValue: number, heightValue: number, borderRadiusValue: number) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

