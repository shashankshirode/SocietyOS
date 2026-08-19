import { StyleSheet } from "react-native";
import { Layout } from "../../constants/layout";
export const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        width: '100%',
    },
    tabletContainer: {
        maxWidth: Layout.maxTabletContentWidth,
    },
});
