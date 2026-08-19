import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { ImageTokens } from "../../theme/imageTokens";
export const styles = StyleSheet.create({
    container: { overflow: 'hidden', borderRadius: Radius.card },
    image: { borderRadius: Radius.card },
    overlay: { flex: 1, justifyContent: 'flex-end', padding: Spacing.xl, backgroundColor: ImageTokens.overlay.strong },
    content: { maxWidth: 560, gap: Spacing.xs },
    eyebrow: { color: '#BFDBFE', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    title: { color: '#FFFFFF', fontSize: 27, fontWeight: '900', lineHeight: 32 },
    subtitle: { color: '#E2E8F0', fontSize: 14, lineHeight: 20 },
});
export function createImageBackgroundHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}

