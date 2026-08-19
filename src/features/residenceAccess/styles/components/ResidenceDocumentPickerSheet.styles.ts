import { StyleSheet } from "react-native";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
export const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxl,
        gap: Spacing.md
    },
    sideRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm
    },
    previewImage: {
        width: '100%',
        height: 260,
        borderRadius: Radius.md
    },
    pdfPreview: {
        height: 180,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    metadata: {
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: Spacing.xs
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm
    },
    progressTrack: {
        flex: 1,
        height: 8,
        borderRadius: 999,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%'
    }
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
export function createViewWidthBackgroundColorStyle(widthValue: `${number}%`, backgroundColorValue: string) {
    return {
        width: widthValue,
        backgroundColor: backgroundColorValue
    } as const;
}

