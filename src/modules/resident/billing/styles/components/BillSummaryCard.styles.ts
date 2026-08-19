import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    card: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 12, overflow: 'hidden' },
    orb: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -60, top: -80, opacity: 0.75 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    headerText: { gap: 2 },
    amount: { fontSize: 34, lineHeight: 40, fontWeight: '800' },
    actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 2 },
    primaryAction: { minHeight: 42, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
    primaryLabel: { color: '#FFFFFF', fontWeight: '700' },
    secondaryAction: { minHeight: 42, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
    ledgerAction: { minHeight: 42, paddingHorizontal: 8, justifyContent: 'center' },
    pressableFlexDirectionAlignItemsGap: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});
export function createSafeTextColorStyle(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: "#CBD5E1" | "#475467") {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle4(colorValue: "#4E46E5" | "#9DA5FF") {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#F9FAFD" | "#172033", borderColorValue: "#253149" | "#E2E6EE") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: "#1E1B4B" | "#E8E5FB") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle5(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}
export function createPressableBackgroundColorStyle(backgroundColorValue: "#4E46E5" | "#9DA5FF") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createPressableBorderColorStyle(borderColorValue: "#253149" | "#E2E6EE") {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: "#052E16" | "#DCFCE7") {
    return {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: backgroundColorValue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        gap: 6
    } as const;
}
export function createSafeTextColorStyle6(colorValue: "#198A59" | "#5BD39A") {
    return {
        color: colorValue,
        fontWeight: '600'
    } as const;
}

