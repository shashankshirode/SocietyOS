import { StyleSheet } from "react-native";
import { Layout } from "../../theme/layout";
import { Radius } from "../../theme/radius";
export const styles = StyleSheet.create({
    base: {
        width: Layout.minimumTouchTarget,
        height: Layout.minimumTouchTarget,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        opacity: 0.75,
    },
    disabled: {
        opacity: 0.45,
    },
});
