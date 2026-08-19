import { StyleSheet, type ViewStyle } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: Radius.lg,
        overflow: 'hidden',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    image: {
        borderRadius: 0,
        width: '100%',
    },
    fallback: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    fallbackText: {
        textAlign: 'center',
    },
    content: {
        padding: Spacing.lg,
        gap: Spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md,
    },
    titleColumn: {
        flex: 1,
        gap: 2,
    },
    rolePill: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 999,
        maxWidth: '42%',
    },
    statusPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    actions: {
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
});
export function createImageHeightStyle(heightValue: 166 | 138) {
    return {
        height: heightValue
    } as const;
}
export function createViewHeightBackgroundColorStyle(heightValue: 166 | 138, backgroundColorValue: string) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorSpread3Style(backgroundColorValue: string, borderColorValue: string, spread3Value: ViewStyle) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        ...spread3Value
    } as const;
}

