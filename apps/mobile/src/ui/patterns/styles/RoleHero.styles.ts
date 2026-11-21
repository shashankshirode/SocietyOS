import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { width: '100%', position: 'relative' },
    gradientBase: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        overflow: 'hidden',
    },
    gradientLayer1: {
        ...StyleSheet.absoluteFill,
        opacity: 0.5,
        transform: [{ translateX: 100 }, { translateY: -40 }, { rotate: '-15deg' }, { scaleX: 1.5 }],
    },
    gradientLayer2: {
        ...StyleSheet.absoluteFill,
        opacity: 0.25,
        transform: [{ translateX: -60 }, { translateY: 80 }, { rotate: '10deg' }, { scaleX: 1.3 }],
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.12,
    },
    decorCircle1: {
        width: 200,
        height: 200,
        right: -40,
        top: -20,
    },
    decorCircle2: {
        width: 140,
        height: 140,
        left: -30,
        bottom: 10,
    },
    badgeRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 6,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    badgeText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '800',
        lineHeight: 32,
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    contextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    contextDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    contextText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        fontWeight: '600',
    },
    slotArea: {
        marginTop: 16,
    },
    curvedEdge: {
        height: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        zIndex: 1,
    },
});
export function createViewBackgroundColorPaddingTopStyle(backgroundColorValue: string, paddingTopValue: number) {
    return {
        backgroundColor: backgroundColorValue,
        paddingTop: paddingTopValue
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle6(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

