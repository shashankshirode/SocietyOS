import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";
import { Layout } from "../../../../shared/constants/layout";
export const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 100,
        borderRadius: Layout.borderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        justifyContent: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 1,
        elevation: 1,
    },
    label: {
        ...Typography.caption,
        color: Colors.neutral,
        fontWeight: '500',
        marginBottom: Spacing.xs,
    },
    value: {
        ...Typography.h2,
        fontWeight: '700',
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.neutral,
        fontSize: 10,
        marginTop: 4,
    },
});
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

