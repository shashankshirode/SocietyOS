import { StyleSheet } from "react-native";
import { Spacing } from "../../../shared/theme/spacing";
import { Typography } from "../../../shared/theme/typography";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrap: {
        marginRight: Spacing.md,
        marginTop: 2,
    },
    textCol: {
        flex: 1,
    },
    title: {
        ...Typography.sectionTitle,
    },
    subtitle: {
        ...Typography.caption,
        marginTop: Spacing.xs,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.sm,
    },
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
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

