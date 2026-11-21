import { StyleSheet, type DimensionValue } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    skeleton: {},
    card: {
        marginBottom: Spacing.sm,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marginRight: {
        marginRight: Spacing.md,
    },
    marginBottomSm: {
        marginBottom: Spacing.xs,
    },
    marginBottomLg: {
        marginBottom: Spacing.md,
    },
    flex1: {
        flex: 1,
    },
});
export function createAnimatedViewBackgroundColorWidthHeightBorderRadiusStyle(backgroundColorValue: string, widthValue: DimensionValue, heightValue: number, borderRadiusValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue,
        height: heightValue,
        borderRadius: borderRadiusValue
    } as const;
}
