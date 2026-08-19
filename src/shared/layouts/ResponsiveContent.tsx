import React from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";
import { Layout } from "../theme/layout";
import { styles } from "./styles/ResponsiveContent.styles";
interface ResponsiveContentProps {
    children: React.ReactNode;
    style?: ViewStyle;
}
export function ResponsiveContent({ children, style }: ResponsiveContentProps) {
    const { width } = useWindowDimensions();
    const isTablet = width > Layout.maxTabletContentWidth;
    return (<View style={[
            styles.container,
            isTablet && styles.tabletContainer,
            style,
        ]}>
      {children}
    </View>);
}
export default ResponsiveContent;

