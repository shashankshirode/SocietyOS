import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    card: {
        marginVertical: Spacing.sm,
    },
    title: {
        marginBottom: Spacing.md,
    },
    list: {
        width: '100%',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    iconContainer: {
        marginRight: Spacing.md,
        opacity: 0.8,
    },
    textContainer: {
        flex: 1,
    },
    value: {
        marginTop: 2,
    },
});
export function createViewBorderTopColorStyle(borderTopColorValue: string) {
    return {
        borderTopWidth: 1,
        borderTopColor: borderTopColorValue
    } as const;
}

