import { StyleSheet } from "react-native";
import { Spacing } from "../../theme/spacing";
import { Layout } from "../../theme/layout";
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
        maxWidth: Layout.maxTabletContentWidth || 680,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    phonePadding: {
        paddingHorizontal: Spacing.screenPaddingPhone,
        paddingBottom: Spacing.xl,
    },
    tabletPadding: {
        paddingHorizontal: Spacing.screenPaddingTablet,
        paddingBottom: Spacing.xxl,
    },
});
export function createSafeAreaViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}

