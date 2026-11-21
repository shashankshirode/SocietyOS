import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    root: { flex: 1 },
    scrollContent: { paddingVertical: 16, paddingBottom: 96 },
    content: { gap: 16 },
    tabletContent: { maxWidth: 1200, alignSelf: 'center' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    headerText: { flex: 1, gap: 2 },
    contentStack: { gap: 16 },
    sectionCard: { gap: 10 },
    skeletonGroup: { gap: 16 },
    errorBlock: { paddingVertical: 8 },
    bottomSpacing: { height: 32 },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

