import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginTop: 24,
    },
    brandTitle: {
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    modeCard: {
        alignItems: 'center',
        paddingVertical: 24,
        width: '100%',
    },
    modeTitle: {
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    modeDesc: {
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 18,
    },
    footer: {
        marginTop: 12,
        alignItems: 'center',
        paddingBottom: 24,
    },
    footerText: {
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 16,
    },
    boxWidth: { width: '100%' }
});
export function createAppTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle3(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle4(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createAppTextColorStyle5(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

