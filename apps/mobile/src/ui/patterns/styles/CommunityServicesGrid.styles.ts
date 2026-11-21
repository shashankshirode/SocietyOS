import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 10
    },
    tile: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 14,
        borderWidth: 1,
        gap: 8,
        minHeight: 156
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        minHeight: 32
    },
    verification: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        borderRadius: 999,
        paddingHorizontal: 7,
        paddingVertical: 3,
        maxWidth: '100%'
    },
    empty: {
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        gap: 8
    }
});
export function createAnimatedViewFlexBasisStyle(flexBasisValue: "31%" | "47%") {
    return {
        flexBasis: flexBasisValue,
        flexGrow: 1
    } as const;
}
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewPaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
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

