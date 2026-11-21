import React from "react";
import { View, ViewStyle, StyleProp, useWindowDimensions } from "react-native";
import { styles, createViewWidthFlexBasisStyle, createViewGapStyle } from "./styles/ResponsiveGrid.styles";
export interface ResponsiveGridProps {
    children: React.ReactNode;
    minColumns?: number;
    maxColumns?: number;
    breakpoint?: number;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function ResponsiveGrid({ children, minColumns = 2, maxColumns = 3, breakpoint = 400, gap = 12, style, testID, }: ResponsiveGridProps) {
    const { width } = useWindowDimensions();
    const columns = width >= breakpoint ? maxColumns : minColumns;
    const childArray = React.Children.toArray(children);
    return (<View style={[styles.grid, createViewGapStyle(gap), style]} testID={testID}>
      {childArray.map((child, index) => (<View key={index} style={createViewWidthFlexBasisStyle(`${(100 / columns) - (gap * (columns - 1)) / (columns * 3.5)}%`, `${(100 / columns) - 1}%`)}>
          {child}
        </View>))}
    </View>);
}

