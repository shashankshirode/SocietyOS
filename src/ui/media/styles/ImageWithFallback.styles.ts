import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    loading: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    image: {
        width: '100%',
        borderRadius: 16,
    },
    fallback: {
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 12,
    },
});
export function createViewHeightBackgroundColorStyle(heightValue: number, backgroundColorValue: string) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}
export function createImageHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}

