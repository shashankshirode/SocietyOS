import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
export const styles = StyleSheet.create({
    base: {
        borderRadius: Radius.card,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
});
