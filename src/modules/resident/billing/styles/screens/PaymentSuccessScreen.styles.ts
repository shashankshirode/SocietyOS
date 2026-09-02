import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingTop: 16 },
    contentStack: { gap: 24 },
    header: { alignItems: 'center', gap: 16, paddingVertical: 12 },
    circle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    headerText: { alignItems: 'center', gap: 6 },
    title: { fontWeight: '800' },
    actions: { marginTop: 4 },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createScrollViewPaddingBottomStyle(paddingBottomValue: number) {
    return {
        paddingBottom: paddingBottomValue
    } as const;
}
export function createAnimatedViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

