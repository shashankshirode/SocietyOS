import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    arrowButton: {
        padding: 6,
    },
    weekdays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 6,
    },
    weekdayText: {
        width: 32,
        textAlign: 'center',
        fontWeight: '700',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    dayCell: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
    },
    dayButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clockHeader: {
        alignItems: 'center',
        marginBottom: 12,
    },
    ampmContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    ampmButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 60,
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    gridItem: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    minutesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
    },
    minuteItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        marginBottom: 8,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorFontWeightStyle(colorValue: string, fontWeightValue: "400" | "700") {
    return {
        color: colorValue,
        fontWeight: fontWeightValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '900'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: string) {
    return {
        color: colorValue,
        alignSelf: 'center',
        marginVertical: 8
    } as const;
}
export function createSafeTextColorStyle6(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle7(colorValue: string) {
    return {
        color: colorValue,
        alignSelf: 'center',
        marginVertical: 8
    } as const;
}
export function createSafeTextColorStyle8(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBorderColorBackgroundColorStyle(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle9(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderWidth: 1,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorBackgroundColorStyle2(borderColorValue: string, backgroundColorValue: string) {
    return {
        borderColor: borderColorValue,
        backgroundColor: backgroundColorValue,
        paddingVertical: 16
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: 'transparent'
    } as const;
}
export function createPressableBorderColorStyle2(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createPressableBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: 'transparent'
    } as const;
}
export function createPressableBorderColorStyle3(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

