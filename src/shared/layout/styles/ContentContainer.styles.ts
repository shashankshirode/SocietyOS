import { StyleSheet } from "react-native";
import { Layout } from "../../theme/layout";
export const styles = StyleSheet.create({
    base: {
        width: '100%',
    },
    tablet: {
        maxWidth: Layout.maxTabletContentWidth || 680,
        alignSelf: 'center',
    },
});
