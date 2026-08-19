import { StyleSheet } from "react-native";
import { Typography } from "../../theme/typography";
import { Radius } from "../../theme/radius";
export const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        ...Typography.sectionTitle,
    },
});
export function createViewWidthHeightBackgroundColorStyle(widthValue: number, heightValue: number, backgroundColorValue: string) {
    return {
        width: widthValue,
        height: heightValue,
        borderRadius: Radius.pill,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorFontSizeStyle(colorValue: string, fontSizeValue: number) {
    return {
        color: colorValue,
        fontSize: fontSizeValue
    } as const;
}

