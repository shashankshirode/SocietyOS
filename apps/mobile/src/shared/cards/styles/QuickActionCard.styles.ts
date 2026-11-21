import { StyleSheet, type ViewStyle } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    card: {
        padding: Spacing.lg,
        flex: 1,
        minHeight: 132,
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    textWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minWidth: 0,
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginTop: Spacing.xxs,
    },
    badge: {
        borderWidth: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        maxWidth: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createAnimatedPressableBorderRadiusBackgroundColorBorderColorSpread4Style(borderRadiusValue: number, backgroundColorValue: string, borderColorValue: string, spread4Value: ViewStyle) {
    return {
        borderRadius: borderRadiusValue,
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        ...spread4Value
    } as const;
}

