import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    contentFrame: {
        paddingHorizontal: 0
    },
    restrictionNotice: {
        marginTop: 20,
        marginHorizontal: 8,
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        gap: 6
    },
    sections: {
        paddingTop: 24
    },
    widePhonePair: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14
    },
    widePhonePairItem: {
        flex: 1,
        minWidth: 0
    },
    tabletColumns: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 28,
        paddingHorizontal: 8
    },
    tabletLeft: {
        flex: 7,
        minWidth: 0
    },
    tabletRight: {
        flex: 5,
        minWidth: 0
    }
});
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
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewGapStyle(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewGapStyle2(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewGapStyle3(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewGapStyle4(gapValue: number) {
    return {
        gap: gapValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

