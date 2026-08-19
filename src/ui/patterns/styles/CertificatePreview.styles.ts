import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1.5,
        padding: 24,
        position: 'relative',
        gap: 16,
    },
    innerBorder: {
        ...StyleSheet.absoluteFillObject,
        margin: 6,
        borderWidth: 1,
        borderStyle: 'solid',
        pointerEvents: 'none',
    },
    header: {
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    certTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1.5,
        textAlign: 'center',
    },
    body: {
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: '800',
        marginVertical: 4,
    },
    statement: {
        lineHeight: 16,
        marginTop: 8,
        paddingHorizontal: 12,
    },
    verifiableSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderTopWidth: 1,
        paddingTop: 16,
        borderStyle: 'dashed',
    },
    qrContainer: {
        borderWidth: 1,
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    verifiableText: {
        flex: 1,
        gap: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    sigContainer: {
        alignItems: 'center',
        gap: 2,
    },
    sigLine: {
        width: 120,
        height: 1,
        marginBottom: 4,
        opacity: 0.3,
    },
    safeTextMarginTop: { marginTop: 4 }
});
export function createSafeTextColorStyle(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#101828" | "#F8FAFC") {
    return {
        fontWeight: '700',
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#FFFFFF" | "#111827", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle7(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle8(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createViewBorderTopColorStyle(borderTopColorValue: "#253149" | "#E2E6EE") {
    return {
        borderTopColor: borderTopColorValue
    } as const;
}
export function createViewBorderColorStyle2(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#CBD5E1" | "#475467") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

