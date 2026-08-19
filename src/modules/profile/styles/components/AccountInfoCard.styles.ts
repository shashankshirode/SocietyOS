import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        width: '100%'
    },
    title: {
        fontWeight: '700',
        marginBottom: Spacing.md
    },
    list: {
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        alignItems: 'center',
        gap: Spacing.md
    },
    label: {
        flexShrink: 1
    },
    value: {
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.5,
        flexWrap: 'wrap'
    }
});
