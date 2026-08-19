import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
import { Radius } from "../../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    dock: {
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.card,
        borderWidth: 1.5,
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
        overflow: 'hidden',
    },
    inner: {
        padding: Spacing.xl,
        gap: Spacing.lg,
    },
});
