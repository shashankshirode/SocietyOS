import React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { styles, createViewBackgroundColorBorderTopColorPaddingBottomPaddingHorizontalStyle } from "./styles/StickyActionFooter.styles";
export type StickyActionFooterProps = {
    children: React.ReactNode;
    bottomInset?: number;
    onHeightChange?: (height: number) => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
export function StickyActionFooter({ children, bottomInset = 0, onHeightChange, style, testID, }: StickyActionFooterProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const { screenPadding } = useResponsiveLayout();
    const lastHeightRef = React.useRef(0);
    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        const newHeight = Math.round(event.nativeEvent.layout.height);
        if (Math.abs(lastHeightRef.current - newHeight) > 2) {
            lastHeightRef.current = newHeight;
            onHeightChange?.(newHeight);
        }
    }, [onHeightChange]);
    const paddingBottom = bottomInset !== undefined ? bottomInset : Math.max(insets.bottom, 16);
    return (<View testID={testID} onLayout={handleLayout} style={[
            styles.container,
            createViewBackgroundColorBorderTopColorPaddingBottomPaddingHorizontalStyle(colors.surface, colors.border, paddingBottom + 12, screenPadding),
            style,
        ]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>);
}
export default StickyActionFooter;

