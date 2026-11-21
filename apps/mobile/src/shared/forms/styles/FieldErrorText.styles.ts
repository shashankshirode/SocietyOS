import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: Spacing.xs,
        flexWrap: 'wrap',
        width: '100%',
    },
    text: {
        flex: 1,
        flexWrap: 'wrap',
        minWidth: 0,
    },
});
