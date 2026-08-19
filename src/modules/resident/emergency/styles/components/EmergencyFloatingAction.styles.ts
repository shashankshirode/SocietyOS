import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 9999,
    },
    floatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
export function createViewBottomRightStyle(bottomValue: number, rightValue: number) {
    return {
        bottom: bottomValue,
        right: rightValue
    } as const;
}
export function createPressableBackgroundColorShadowColorStyle(backgroundColorValue: string, shadowColorValue: string) {
    return {
        backgroundColor: backgroundColorValue,
        shadowColor: shadowColorValue
    } as const;
}

