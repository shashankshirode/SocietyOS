import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 16,
    },
});
export function createViewHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}

