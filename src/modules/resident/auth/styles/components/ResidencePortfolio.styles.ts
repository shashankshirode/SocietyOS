import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    phoneLayout: {
        gap: Spacing.xl
    },
    carouselSection: {
        gap: Spacing.md
    },
    carouselContainer: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md
    },
    carouselCard: {
        marginRight: Spacing.md
    },
    indicatorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6
    },
    dot: {
        height: 6,
        borderRadius: 3
    },
    otherSection: {
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md
    },
    sectionHeader: {
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    verticalList: {
        gap: Spacing.md
    },
    tabletGrid: {
        gap: Spacing.xxl,
        paddingHorizontal: Spacing.lg
    },
    gridSection: {
        gap: Spacing.md
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.lg
    },
    gridCell: {
        width: '48%'
    }
});
export function createViewWidthStyle(widthValue: number) {
    return {
        width: widthValue
    } as const;
}
export function createViewBackgroundColorWidthStyle(backgroundColorValue: string, widthValue: 16 | 6) {
    return {
        backgroundColor: backgroundColorValue,
        width: widthValue
    } as const;
}

