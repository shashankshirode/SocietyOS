import { StyleSheet, type DimensionValue } from 'react-native';
export const styles = StyleSheet.create({});
export function createAnimatedViewWidthHeightBorderRadiusBackgroundColorStyle(widthValue: DimensionValue, heightValue: number, borderRadiusValue: number, backgroundColorValue: string) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue,
        backgroundColor: backgroundColorValue
    } as const;
}

