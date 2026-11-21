import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { gap: 12 },
    card: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        gap: 12
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepper: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    stepItem: { alignItems: 'center', flex: 1 },
    stepVisual: { flexDirection: 'row', alignItems: 'center', width: '100%' },
    stepNode: {
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    },
    stepNodeCurrent: { width: 20, height: 20, borderRadius: 10 },
    stepPulse: { width: 6, height: 6, borderRadius: 3 },
    stepLine: { flex: 1, height: 2, marginLeft: -1 },
    stepLabel: { marginTop: 6, fontSize: 10, fontWeight: '600', textAlign: 'center' },
    slaSection: { gap: 6 },
    slaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    slaTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
    slaBar: { height: '100%', borderRadius: 3 },
    assignedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    updateBlock: {
        borderRadius: 11,
        padding: 10,
        gap: 3
    },
    updateLabel: { fontWeight: '800' },
    nextActionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8
    },
    nextActionText: { flex: 1, gap: 2 },
    footerRow: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },
    viewAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '800'
    } as const;
}
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
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createViewBackgroundColorStyle4(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewWidthBackgroundColorStyle(widthValue: `${number}%`, backgroundColorValue: string) {
    return {
        width: widthValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle5(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

