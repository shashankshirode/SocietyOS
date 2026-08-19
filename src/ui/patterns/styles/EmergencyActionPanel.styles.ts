import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    panel: {
        marginHorizontal: 20,
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 16,
        gap: 16,
    },
    sosArea: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    sosButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#DC2626',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    sosText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '900',
        marginTop: -2,
    },
    sosProgress: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    sosInfo: { flex: 1, gap: 2 },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 100,
    },
    chipLabel: {
        fontWeight: '700',
        fontSize: 11,
    },
});
export function createSafeTextColorStyle(colorValue: "#F87171" | "#991B1B") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#FCA5A5" | "#B91C1C") {
    return {
        color: colorValue,
        opacity: 0.8
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#2D0A0A" | "#FEF2F2", borderColorValue: "#7F1D1D" | "#FECACA") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle2(backgroundColorValue: "#1C0505" | "#FFF5F5", borderColorValue: "#450A0A" | "#FEE2E2") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#FCA5A5" | "#991B1B") {
    return {
        color: colorValue
    } as const;
}

