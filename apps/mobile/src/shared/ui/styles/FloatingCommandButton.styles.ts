import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
});
export function createPressableBackgroundColorTransformStyle(backgroundColorValue: string, transformValue: {
    scale: number;
}[]) {
    return {
        backgroundColor: backgroundColorValue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        transform: transformValue
    } as const;
}
export function createPressableScaleStyle(scaleValue: 1 | 0.95) {
    return {
        scale: scaleValue
    } as const;
}

