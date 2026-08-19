import { StyleSheet } from "react-native";
import { Colors } from "../../theme";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.screenPaddingPhone,
        paddingBottom: Spacing.xxxl,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

