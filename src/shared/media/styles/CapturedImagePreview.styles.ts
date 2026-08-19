import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingBottom: Spacing.xl,
    },
    preview: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    btn: {
        flex: 1,
    },
});
