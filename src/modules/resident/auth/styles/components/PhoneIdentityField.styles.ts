import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radius.input,
        minHeight: 54,
        overflow: 'hidden',
    },
    countryTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        borderRightWidth: 1,
        height: '100%',
        minWidth: 104,
    },
    flag: {
        fontSize: 18,
        marginRight: 4,
    },
    code: {
        fontWeight: '700',
        fontSize: 15,
    },
    chevron: {
        marginLeft: 4,
    },
    input: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    validBadge: {
        paddingRight: Spacing.md,
    },
    errorContainer: {
        height: 18,
        marginTop: 2,
    },
    errorText: {
        fontWeight: '600',
        fontSize: 11,
    },
});
export function createViewBorderColorBackgroundColorBorderWidthStyle(borderColorValue: string, backgroundColorValue: "#131926" | "#F1F3F5", borderWidthValue: 1 | 1.5) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        borderWidth: borderWidthValue
    } as const;
}
export function createPressableBorderRightColorStyle(borderRightColorValue: "rgba(255, 255, 255, 0.1)" | "rgba(15, 23, 42, 0.1)") {
    return {
        borderRightColor: borderRightColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

