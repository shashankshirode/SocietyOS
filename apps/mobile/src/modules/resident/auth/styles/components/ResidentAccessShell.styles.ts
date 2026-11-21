import { StyleSheet } from "react-native";
import { Spacing } from "../../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    landscapeSplitLayout: {
        flex: 1,
        flexDirection: 'row',
    },
    leftVisualContainer: {
        width: '45%',
        height: '100%',
    },
    rightFormContainer: {
        width: '55%',
        height: '100%',
        justifyContent: 'center',
    },
    tabletInnerWrapper: {
        width: '100%',
        maxWidth: 460,
        alignSelf: 'center',
        paddingVertical: Spacing.md,
    },
    tabletPortraitLayout: {
        flex: 1,
    },
    tabletPortraitVisual: {
        height: 320,
        width: '100%',
    },
    tabletPortraitForm: {
        flex: 1,
    },
    phoneLayout: {
        flex: 1,
    },
    phoneVisualArea: {
        width: '100%',
    },
    phoneFormArea: {
        flex: 1,
        marginTop: -24,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    viewMaxHeight: { maxHeight: 400 }
});
export function createViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle2(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createViewBackgroundColorStyle3(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createKeyboardAvoidingViewBackgroundColorStyle(backgroundColorValue: string) {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
