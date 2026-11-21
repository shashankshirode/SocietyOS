import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 10,
    },
    primaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 14,
    },
    primaryIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryText: { flex: 1, gap: 2 },
    primaryLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
    primaryDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    secondaryRow: {
        flexDirection: 'row',
        gap: 10,
    },
    secondaryItem: { flex: 1 },
    secondaryCard: {
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        gap: 8,
    },
    secondaryIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryLabel: { textAlign: 'center', fontSize: 12, fontWeight: '600' },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
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
export function createViewBackgroundColorStyle2(backgroundColorValue: "rgba(248,113,113,0.15)" | "rgba(220,38,38,0.08)" | "rgba(129,140,248,0.15)" | "rgba(67,56,202,0.08)") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

