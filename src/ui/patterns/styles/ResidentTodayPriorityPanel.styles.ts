import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    headerTablet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        gap: 20,
    },
    titleContainerTablet: {
        flex: 1,
    },
    badgeViewAllContainerTablet: {
        alignItems: 'flex-end',
        gap: 8,
    },
    headerMobile: {
        paddingHorizontal: 20,
        gap: 4,
    },
    headerRowMobile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    titleContainerMobile: {
        flex: 1,
    },
    titleText: {
        fontWeight: '800',
        flexWrap: 'wrap',
    },
    subtitleText: {
        marginTop: 2,
        flexWrap: 'wrap',
    },
    badgeCompact: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 24,
    },
    badgeText: {
        fontWeight: '800',
    },
    viewAllButtonTablet: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minHeight: 44,
    },
    viewAllButtonMobile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
        minHeight: 44,
    },
    rail: {
        gap: 12,
        paddingVertical: 2,
    },
    tabletGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 16,
    },
    tabletGridItem: {
        width: '48%',
        minWidth: 300,
        maxWidth: 420,
    },
    emptyCard: {
        marginHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        gap: 6,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewWidthStyle(widthValue: number) {
    return {
        width: widthValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createScrollViewPaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createPressablePaddingHorizontalStyle(paddingHorizontalValue: number) {
    return {
        paddingHorizontal: paddingHorizontalValue
    } as const;
}

