import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        gap: 24,
        paddingBottom: 40,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 24,
    },
    actions: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    buttonStack: {
        gap: 12,
    },
    viewPaddingHorizontal: { paddingHorizontal: 20 },
    viewPaddingHorizontal2: { paddingHorizontal: 20 }
});
export function createViewBackgroundColorStyle(backgroundColorValue: "#F4F6FB" | "#080D18") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createSafeTextColorStyle(colorValue: "#101828" | "#F8FAFC") {
    return {
        color: colorValue
    } as const;
}

