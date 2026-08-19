import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { styles, createViewMaxWidthPaddingHorizontalStyle } from "./styles/ContentFrame.styles";
interface ContentFrameProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    maxWidth?: number;
}
export function ContentFrame({ children, style, maxWidth }: ContentFrameProps) {
    const { contentMaxWidth, screenPadding, isTablet } = useResponsiveLayout();
    const resolvedMax = maxWidth ?? contentMaxWidth;
    return (<View style={[
            styles.container,
            createViewMaxWidthPaddingHorizontalStyle(resolvedMax, screenPadding),
            isTablet && styles.tabletCenter,
            style,
        ]}>
      {children}
    </View>);
}
export default ContentFrame;

