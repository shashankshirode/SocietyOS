import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: 12,
        gap: 16,
    },
    searchContainer: {
        paddingHorizontal: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
    },
    filterBar: {
        paddingHorizontal: 20,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    listContent: {
        gap: 10,
    },
    card: {
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginHorizontal: 20,
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
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
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
export function createSafeTextColorStyle2(colorValue: "#FFFFFF" | "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#CBD5E1" | "#475467") {
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
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createFlatListPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createTextInputColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827" | "#4E46E5" | "#9DA5FF", borderColorValue: "transparent" | "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}

