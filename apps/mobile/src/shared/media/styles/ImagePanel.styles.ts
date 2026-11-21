import { StyleSheet } from "react-native";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
export const styles = StyleSheet.create({
    container: { overflow: 'hidden', borderRadius: Radius.card },
    image: { borderRadius: Radius.card },
    overlay: { flex: 1, justifyContent: 'flex-end', padding: Spacing.xl, gap: Spacing.sm }
});
export function createViewBackgroundColorStyle(backgroundColorValue: "rgba(15, 23, 42, 0.34)" | "rgba(15, 23, 42, 0.56)") {
    return {
        backgroundColor: backgroundColorValue
    } as const;
}
export function createImageBackgroundHeightStyle(heightValue: number) {
    return {
        height: heightValue
    } as const;
}
