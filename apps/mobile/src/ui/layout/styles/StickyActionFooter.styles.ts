import { StyleSheet } from "react-native";
import { Layout } from "../../../shared/theme/layout";
export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: 12,
    },
    content: {
        width: '100%',
        maxWidth: Layout.maxTabletContentWidth,
        alignSelf: 'center',
    },
});
export function createViewBackgroundColorBorderTopColorPaddingBottomPaddingHorizontalStyle(backgroundColorValue: string, borderTopColorValue: string, paddingBottomValue: number, paddingHorizontalValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        borderTopColor: borderTopColorValue,
        paddingBottom: paddingBottomValue,
        paddingHorizontal: paddingHorizontalValue
    } as const;
}

