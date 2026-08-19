import React from "react";
import { View, ViewStyle, StyleProp, useWindowDimensions } from "react-native";
import { styles, createViewGapStyle } from "./styles/AdaptiveStack.styles";
export interface AdaptiveStackProps {
    children: React.ReactNode;
    breakpoint?: number;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function AdaptiveStack({ children, breakpoint = 360, gap = 12, style, testID, }: AdaptiveStackProps) {
    const { width } = useWindowDimensions();
    const isRow = width >= breakpoint;
    return (<View style={[
            isRow ? styles.row : styles.column,
            createViewGapStyle(gap),
            style,
        ]} testID={testID}>
      {children}
    </View>);
}

