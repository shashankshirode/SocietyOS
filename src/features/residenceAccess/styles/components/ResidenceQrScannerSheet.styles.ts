import { StyleSheet } from "react-native";
import { Radius } from "../../../../shared/theme/radius";
import { Spacing } from "../../../../shared/theme/spacing";
export const styles = StyleSheet.create({
    sheet: { minHeight: 480 },
    content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
    cameraFrame: { width: '100%', aspectRatio: 1, borderWidth: 3, borderRadius: Radius.lg, overflow: 'hidden' },
    permission: { minHeight: 240, justifyContent: 'center', gap: Spacing.lg },
});
export function createViewBorderColorStyle(borderColorValue: string) {
    return {
        borderColor: borderColorValue
    } as const;
}

