import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    tabletCenter: {
        alignSelf: 'center',
    },
});
export function createViewMaxWidthPaddingHorizontalStyle(maxWidthValue: number, paddingHorizontalValue: number) {
    return {
        maxWidth: maxWidthValue,
        paddingHorizontal: paddingHorizontalValue
    } as const;
}

