import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export function createViewHeightBackgroundColorStyle(heightValue: number, backgroundColorValue: string) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

