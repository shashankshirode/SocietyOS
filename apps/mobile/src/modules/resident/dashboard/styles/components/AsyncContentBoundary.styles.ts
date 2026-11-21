import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    skeletonCard: {
        marginHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        gap: 14
    },
    skeletonHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    skeletonHeaderText: { flex: 1, gap: 6 },
    skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    skeletonRowText: { flex: 1, gap: 7 },
    stateCard: {
        marginHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1,
        padding: 22,
        alignItems: 'center',
        gap: 8
    },
    stateIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2
    },
    retryButton: {
        minHeight: 44,
        borderRadius: 12,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
    }
});
export function createSafeTextColorStyle(colorValue: string) {
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
export function createViewBackgroundColorBorderColorStyle3(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

