import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
        position: 'relative',
        marginVertical: Spacing.sm,
    },
    accentLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    titleContainer: {
        flex: 1,
        marginRight: Spacing.md,
    },
    subtitle: {
        marginTop: Spacing.xs,
    },
    status: {
        alignSelf: 'flex-start',
    },
    info: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: Spacing.md,
        marginTop: Spacing.xs,
    },
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

