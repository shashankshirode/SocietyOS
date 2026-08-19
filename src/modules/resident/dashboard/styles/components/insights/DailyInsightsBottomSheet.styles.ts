import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingBottom: 24
    },
    container: {
        gap: 12,
        paddingTop: 8
    },
    paginationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 12
    },
    navButton: {
        padding: 6
    },
    indicatorHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    paginationText: {
        fontWeight: '700',
        fontSize: 13
    },
    cardWithNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardContainer: {
        flex: 1,
    },
    middleNavButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    disabledNavButton: {
        opacity: 0.35,
    },
    contentStack: {
        gap: 12
    },
    tabletContentGrid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20
    },
    tabletCardContainer: {
        flex: 1.2
    },
    supportStack: {
        flex: 1
    },
    explanationSection: {
        marginTop: 4
    },
    explanationLink: {
        alignSelf: 'flex-start',
        paddingVertical: 6
    }
});
export function createSafeTextColorStyle(colorValue: string) {
    return {
        color: colorValue,
        fontWeight: '700'
    } as const;
}
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}
export function createViewBackgroundColorBorderColorStyle(backgroundColorValue: string, borderColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        borderColor: borderColorValue,
    } as const;
}

