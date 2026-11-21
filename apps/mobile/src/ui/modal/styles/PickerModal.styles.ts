import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Radius } from "../../../shared/theme/radius";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    list: {
        maxHeight: 360,
        paddingHorizontal: Spacing.sm,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.sm,
    },
    optionIcon: {
        marginRight: Spacing.md,
    },
    optionLabel: {
        ...Typography.body,
        flex: 1,
    },
});
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorFontWeightStyle(colorValue: string, fontWeightValue: "400" | "600") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}

