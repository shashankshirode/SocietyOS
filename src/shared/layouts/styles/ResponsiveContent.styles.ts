import { StyleSheet } from "react-native";
import { Layout } from "../../theme/layout";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    },
    tabletContainer: {
        maxWidth: Layout.maxTabletContentWidth,
        alignSelf: 'center',
        paddingHorizontal: Spacing.xl,
    },
});
