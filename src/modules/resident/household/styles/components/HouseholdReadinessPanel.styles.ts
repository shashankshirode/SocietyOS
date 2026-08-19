import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        gap: 14,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    headerText: {
        flex: 1,
        gap: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    progressRow: {
        gap: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tabletGrid: {
        flexDirection: 'row',
    },
    metric: {
        flexGrow: 1,
        minWidth: 120,
        borderRadius: 12,
        padding: 12,
        gap: 3,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
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
export function createViewBackgroundColorWidthStyle(backgroundColorValue: string, widthValue: `${number}%`) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

