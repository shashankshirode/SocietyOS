import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden'
    },
    contentRow: {
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: 14,
        paddingBottom: 16
    },
    tabletContentRow: {
        minHeight: 72,
        paddingHorizontal: Spacing.xl
    },
    backSpacer: {
        width: 0
    },
    rightArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: Spacing.xs
    }
});
export function createViewPaddingTopBorderBottomColorStyle(paddingTopValue: number, borderBottomColorValue: string) {
    return {
        paddingTop: paddingTopValue,
        borderBottomColor: borderBottomColorValue
    } as const;
}

