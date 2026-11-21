import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    body: {
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing['3xl'],
        paddingBottom: Spacing.lg
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg
    },
    title: {
        ...Typography.sectionTitle,
        textAlign: 'center'
    },
    message: {
        ...Typography.body,
        textAlign: 'center',
        marginTop: Spacing.sm
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
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

