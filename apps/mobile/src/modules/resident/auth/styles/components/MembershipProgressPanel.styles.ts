import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    container: {
        gap: Spacing.xs,
        paddingVertical: Spacing.xs,
    },
    lineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    line: {
        flex: 1,
        height: 2,
        marginHorizontal: 4,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        width: 50,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

