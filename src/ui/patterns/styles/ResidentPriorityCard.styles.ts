import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 14,
        flexDirection: 'row',
        gap: 12,
        elevation: 2,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
    },
    iconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leading: {
        alignItems: 'center',
        gap: 8,
    },
    rank: {
        fontWeight: '900',
        letterSpacing: 0.8,
    },
    content: {
        flex: 1,
        gap: 6,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
    },
    meta: {
        fontWeight: '800',
        maxWidth: 96,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        alignSelf: 'flex-start',
    },
    actionLabel: {
        fontWeight: '800',
    },
});
export function createViewBackgroundColorBorderColorShadowColorStyle(backgroundColorValue: string, borderColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        shadowColor: shadowColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
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

