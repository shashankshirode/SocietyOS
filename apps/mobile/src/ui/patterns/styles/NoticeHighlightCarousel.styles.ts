import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 16,
        paddingVertical: 8,
    },
    headerContainer: {
        justifyContent: 'space-between',
        gap: 6,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerColumn: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    headerTitleContainer: {
        flex: 1,
        gap: 2,
    },
    subtitleText: {
        lineHeight: 16,
    },
    viewAllMobile: {
        alignSelf: 'flex-start',
        marginTop: 2,
        minHeight: 44,
        justifyContent: 'center',
    },
    listContent: {
        gap: 12,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    empty: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        gap: 8,
    },
    viewFlexDirectionAlignItems: { flexDirection: 'row', alignItems: 'center' }
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
export function createViewWidthStyle(widthValue: number) {
    return {
        width: widthValue
    } as const;
}
export function createViewPaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createViewBackgroundColorBorderColorMarginHorizontalStyle(backgroundColorValue: string, borderColorValue: string, marginHorizontalValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
        marginHorizontal: marginHorizontalValue
    } as const;
}
export function createViewPaddingHorizontalStyle2(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createFlatListPaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}

