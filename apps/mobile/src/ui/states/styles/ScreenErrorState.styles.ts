import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

