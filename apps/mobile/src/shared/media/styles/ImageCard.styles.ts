import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { ImageTokens } from "../../theme/imageTokens";
export const styles = StyleSheet.create({
    container: { overflow: 'hidden', borderRadius: Radius.card },
    image: { borderRadius: Radius.card },
    overlay: { flex: 1, justifyContent: 'flex-end', padding: Spacing.lg },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
    subtitle: { color: '#E2E8F0', fontSize: 13, lineHeight: 18, marginTop: Spacing.xs },
    viewBackgroundColor: { backgroundColor: ImageTokens.overlay.medium }
});
export function createImageBackgroundHeightBackgroundColorStyle(heightValue: number, backgroundColorValue: string) {
    return {
        height: heightValue,
        backgroundColor: backgroundColorValue
    } as const;
}

