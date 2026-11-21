import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12,
        paddingHorizontal: 16,
    },
});
export function createViewBackgroundColorBorderTopColorPaddingBottomStyle(backgroundColorValue: string, borderTopColorValue: string, paddingBottomValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue,
        paddingBottom: paddingBottomValue
    } as const;
}

