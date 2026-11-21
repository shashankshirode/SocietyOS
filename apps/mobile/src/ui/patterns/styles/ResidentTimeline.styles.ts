import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 0,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 12,
        minHeight: 80,
    },
    leftCol: {
        alignItems: 'center',
        width: 24,
    },
    node: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    line: {
        width: 2,
        flex: 1,
        marginTop: -2,
        marginBottom: -4,
    },
    contentCard: {
        flex: 1,
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    pillContainer: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        marginTop: 4
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
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

