import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { societyContent } from "../../theme/societyTheme";
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    responsiveWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
    },
    tabletContainer: {
        maxWidth: societyContent.readableWidth,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    phonePadding: {
        paddingHorizontal: societyContent.phonePadding,
        paddingBottom: Spacing.xl,
    },
    tabletPadding: {
        paddingHorizontal: societyContent.tabletPadding,
        paddingBottom: Spacing.xxl,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
