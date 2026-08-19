import { StyleSheet } from "react-native";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        minWidth: 0,
    },
    context: {
        ...Typography.caption,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    title: {
        ...Typography.sectionTitle,
        fontSize: 20,
        lineHeight: 24,
    },
    subtitle: {
        ...Typography.caption,
        marginTop: 2,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

