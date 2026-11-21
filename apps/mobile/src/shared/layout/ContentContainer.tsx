import React from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";
import { styles } from "./styles/ContentContainer.styles";
export interface ContentContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}
export function ContentContainer({ children, style }: ContentContainerProps) {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    return (<View style={[
            styles.base,
            isTablet && styles.tablet,
            style,
        ]}>
      {children}
    </View>);
}
export default ContentContainer;

