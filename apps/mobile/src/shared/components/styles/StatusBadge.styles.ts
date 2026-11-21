import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: Spacing.sm + 4,
        paddingVertical: Spacing.xs,
        borderRadius: 999,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '100%',
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        lineHeight: 16,
        letterSpacing: 0.2,
        flexShrink: 1,
    },
});
