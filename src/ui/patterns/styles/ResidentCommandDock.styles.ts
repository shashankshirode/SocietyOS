import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    titleBlock: {
        paddingHorizontal: 20,
        gap: 2,
    },
    dock: {
        marginHorizontal: 20,
        borderRadius: 22,
        borderWidth: 1,
        padding: 10,
        gap: 10,
    },
    primaryRow: {
        flexDirection: 'row',
        gap: 8,
    },
    action: {
        flex: 1,
        minHeight: 84,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 6,
    },
    primaryAction: {
        minHeight: 104,
    },
    secondaryAction: {
        flexBasis: 88,
        minHeight: 82,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontWeight: '800',
        minHeight: 26,
    },
    actionBadge: {
        borderRadius: 999,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    secondaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        borderTopWidth: 1,
        paddingTop: 10,
    },
    moreButton: {
        minHeight: 44,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
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
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

