import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    sectionDesc: {
        fontSize: 12,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardContent: {
        paddingVertical: 4,
    },
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue
    } as const;
}
export function createSafeTextColorStyle2(colorValue: string) {
    return {
        color: colorValue
    } as const;
}

