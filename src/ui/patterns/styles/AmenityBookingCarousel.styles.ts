import { StyleSheet } from "react-native";
import { residentColors } from "../../../shared/theme/residentColors";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12
    },
    tabletGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    card: {
        width: 200,
        height: 220,
        borderRadius: 18,
        overflow: 'hidden'
    },
    overlay1: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.35,
        transform: [{ translateX: 80 }, { translateY: -40 }, { rotate: '-20deg' }, { scaleX: 1.5 }]
    },
    decorCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.12,
        right: -20,
        top: -20
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: residentColors.imageScrim
    },
    cardContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between'
    },
    cardCenter: { flex: 1, justifyContent: 'center' },
    amenityName: {
        color: residentColors.lightSurface,
        fontSize: 18,
        fontWeight: '800'
    },
    cardMeta: { gap: 4 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { color: residentColors.onBrandMedium, fontSize: 11 },
    nextSlotText: { color: residentColors.lightSurface, fontSize: 11, fontWeight: '800' },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6
    },
    price: { color: residentColors.lightSurface, fontSize: 14, fontWeight: '700' },
    bookBtn: {
        minHeight: 44,
        justifyContent: 'center',
        backgroundColor: residentColors.onBrandSoft,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: residentColors.onBrandFaint
    },
    bookText: { color: residentColors.lightSurface, fontWeight: '700', fontSize: 11 },
    empty: {
        marginHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        gap: 8
    }
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewSpread1Style(spread1Value: Partial<Record<"backgroundColor", "#142454" | "#4E46E5" | "#3268D8" | "#159E96" | "#111827" | "#172033" | "#B97818">>) {
    return {
        ...spread1Value
    } as const;
}
export function createViewSpread1Style2(spread1Value: Partial<Record<"backgroundColor", "#142454" | "#4E46E5" | "#3268D8" | "#159E96" | "#111827" | "#172033" | "#B97818">>) {
    return {
        ...spread1Value
    } as const;
}
export function createViewSpread1Style3(spread1Value: Partial<Record<"backgroundColor", "#142454" | "#4E46E5" | "#3268D8" | "#159E96" | "#111827" | "#172033" | "#B97818">>) {
    return {
        ...spread1Value
    } as const;
}
