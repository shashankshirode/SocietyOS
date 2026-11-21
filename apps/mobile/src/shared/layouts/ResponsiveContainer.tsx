import React from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";
import { Layout } from "../constants/layout";
import { styles } from "./styles/ResponsiveContainer.styles";
interface ResponsiveContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
}
export function ResponsiveContainer({ children, style, contentStyle, }: ResponsiveContainerProps) {
    const { width } = useWindowDimensions();
    const isTablet = width > Layout.maxTabletContentWidth;
    return (<View style={[styles.outerContainer, style]}>
      <View style={[
            styles.innerContainer,
            isTablet && styles.tabletContainer,
            contentStyle,
        ]}>
        {children}
      </View>
    </View>);
}

