import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    filterBar: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    divider: {
        height: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    footerLoader: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    emptyContainer: {
        minHeight: 200,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    ioniconsMarginBottom: { marginBottom: 12 }
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#FFFFFF" | "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        marginTop: 4
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createFlatListPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}

