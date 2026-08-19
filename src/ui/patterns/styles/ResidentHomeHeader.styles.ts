import { StyleSheet } from "react-native";
import { residentColors } from "../../../shared/theme/residentColors";
export const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    gradientBase: {
        minHeight: 276,
        paddingBottom: 26,
        overflow: 'hidden'
    },
    inner: {
        width: '100%',
        alignSelf: 'center'
    },
    layer1: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
        transform: [{ translateX: 120 }, { translateY: -60 }, { rotate: '-18deg' }, { scaleX: 1.6 }]
    },
    layer2: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        transform: [{ translateX: -80 }, { translateY: 100 }, { rotate: '12deg' }, { scaleX: 1.4 }]
    },
    decorCircle1: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        opacity: 0.08,
        right: -50,
        top: -30
    },
    decorCircle2: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        opacity: 0.06,
        left: -40,
        bottom: 0
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    topLeft: { flexDirection: 'row', alignItems: 'center' },
    topRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    topAction: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: residentColors.onBrandSubtle,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        maxWidth: 210
    },
    badgeDot: { width: 6, height: 6, borderRadius: 3 },
    roleText: {
        color: residentColors.onBrandStrong,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    notifBadgeContainer: { position: 'relative' },
    notifBadge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: residentColors.danger,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3
    },
    notifText: { color: residentColors.onBrand, fontSize: 9, fontWeight: '800' },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: residentColors.onBrandStrong,
        alignItems: 'center',
        justifyContent: 'center'
    },
    greetingArea: { gap: 4 },
    greeting: {
        color: residentColors.onBrand,
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 40,
        letterSpacing: 0
    },
    subtitle: {
        color: residentColors.onBrandMedium,
        fontSize: 15,
        fontWeight: '500'
    },
    contextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6
    },
    societyName: {
        color: residentColors.onBrandMuted,
        fontSize: 12,
        fontWeight: '600',
        flexShrink: 1
    },
    contextDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: residentColors.onBrandFaint
    },
    actionCount: {
        color: residentColors.attentionOnBrand,
        fontSize: 12,
        fontWeight: '600',
        flexShrink: 0
    }
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
export function createViewMaxWidthPaddingHorizontalStyle(maxWidthValue: number, paddingHorizontalValue: number) {
    return {
        maxWidth: maxWidthValue,
        paddingHorizontal: paddingHorizontalValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

