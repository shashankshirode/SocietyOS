import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
export const styles = StyleSheet.create({
    containerWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    base: {
        borderRadius: Radius.button,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: Spacing.sm,
    },
    text: {
        ...Typography.button,
        textAlign: 'center',
        flexShrink: 1,
    },
    iconContainer: {
        marginHorizontal: Spacing.xs,
    },
});
export function createViewOpacityStyle(opacityValue: 0 | 1) {
    return {
        opacity: opacityValue
    } as const;
}

