import { StyleSheet, type ViewStyle } from "react-native";
import { Colors } from "../../theme";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { Layout } from "../../theme/layout";
export const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        ...Typography.formLabel,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    required: {
        color: Colors.danger,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Layout.inputHeight,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.input,
        backgroundColor: Colors.surface,
        paddingHorizontal: Spacing.lg,
    },
    wrapperError: {
        borderColor: Colors.danger,
    },
    wrapperDisabled: {
        backgroundColor: Colors.surfaceMuted,
        borderColor: Colors.border,
    },
    input: {
        flex: 1,
        height: '100%',
        ...Typography.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        padding: 0,
    },
    multilineInput: {
        height: undefined,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.md,
    },
    inputDisabled: {
        color: Colors.textDisabled,
    },
    leftIconContainer: {
        marginRight: Spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightActionContainer: {
        marginLeft: Spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        ...Typography.formError,
        color: Colors.danger,
        marginTop: Spacing.xs,
    },
    helperText: {
        ...Typography.caption,
        color: Colors.textMuted,
        marginTop: Spacing.xs,
    },
    viewHeightAlignItems: { height: undefined, alignItems: 'stretch' }
});
export function createTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputMinHeightStyle(minHeightValue: number) {
    return {
        minHeight: minHeightValue
    } as const;
}
export function createTextInputColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderColorBackgroundColorShadowColorSpread4Style(borderColorValue: string, backgroundColorValue: string, shadowColorValue: string, spread4Value: ViewStyle) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        shadowColor: shadowColorValue,
        ...spread4Value
    } as const;
}

