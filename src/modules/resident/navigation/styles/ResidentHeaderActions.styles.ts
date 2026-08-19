import { StyleSheet } from "react-native";
import { Radius } from "../../../../shared/theme/radius";
import { Spacing } from "../../../../shared/theme/spacing";
import { Typography } from "../../../../shared/theme/typography";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    actionButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 3,
        right: 1,
        minWidth: 18,
        height: 18,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        ...Typography.caption,
        fontSize: 10,
        fontWeight: '800',
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

