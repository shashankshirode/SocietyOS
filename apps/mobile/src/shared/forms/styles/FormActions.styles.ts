import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.md,
        marginTop: Spacing.xl,
        width: '100%',
        flexWrap: 'wrap',
    },
});
