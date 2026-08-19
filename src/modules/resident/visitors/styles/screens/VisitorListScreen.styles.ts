import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    unavailableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 8,
    },
    tabContainer: {
        paddingTop: 18,
        paddingBottom: 14,
    },
    tabScroll: {
        paddingHorizontal: 20,
        gap: 10,
        flexGrow: 1,
    },
    tabChip: {
        flex: 1,
        minWidth: 112,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
    },
    scrollContent: {
        paddingBottom: 132,
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
});
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        marginTop: 16
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        textAlign: 'center',
        marginTop: 8
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#FFFFFF" | "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#F4F6FB" | "#080D18") {
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
export function createViewBottomStyle(bottomValue: number) {
    return {
        bottom: bottomValue
    } as const;
}
export function createPressableScaleBackgroundColorStyle(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

