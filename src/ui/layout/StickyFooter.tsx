import React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderTopColorPaddingBottomStyle } from "./styles/StickyFooter.styles";
export type StickyFooterProps = {
    children: React.ReactNode;
    onHeightChange?: (height: number) => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};
export function StickyFooter({ children, onHeightChange, style, testID }: StickyFooterProps) {
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const lastHeightRef = React.useRef(0);
    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        const newHeight = Math.round(event.nativeEvent.layout.height);
        if (Math.abs(lastHeightRef.current - newHeight) > 2) {
            lastHeightRef.current = newHeight;
            onHeightChange?.(newHeight);
        }
    }, [onHeightChange]);
    return (<View testID={testID} onLayout={handleLayout} style={[
            styles.container,
            createViewBackgroundColorBorderTopColorPaddingBottomStyle(colors.surface, colors.border, Math.max(insets.bottom, 12)),
            style,
        ]}>
      {children}
    </View>);
}
export default StickyFooter;

