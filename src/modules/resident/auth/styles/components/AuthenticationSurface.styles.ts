import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    surface: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderTopWidth: 1.5,
        flex: 1,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -6 },
        elevation: 4,
    },
    curveHeader: {
        height: Spacing.md,
    },
    body: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
        gap: Spacing.md,
        flex: 1,
    },
    headerBlock: {
        gap: Spacing.xs,
        alignItems: 'flex-start',
    },
    eyebrow: {
        fontWeight: '800',
        fontSize: 9.5,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    title: {
        fontWeight: '800',
        fontSize: 24,
        letterSpacing: -0.2,
    },
    subtitle: {
        lineHeight: 18,
    },
    childrenContainer: {
        gap: Spacing.md,
    },
    spacer: {
        flex: 1,
        minHeight: Spacing.md,
    },
    footerContainer: {
        marginTop: Spacing.xs,
    },
});
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: "#0A0E1A" | "#FAF9F6", borderColorValue: "rgba(255, 255, 255, 0.05)" | "rgba(15, 23, 42, 0.04)") {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue
    } as const;
}
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

