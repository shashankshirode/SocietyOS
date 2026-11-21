import React from "react";
import { View, useWindowDimensions, ViewStyle, StyleProp } from "react-native";
import { styles, createViewWidthPaddingStyle } from "./styles/ResponsiveGrid.styles";
export interface ResponsiveGridProps {
    children: React.ReactNode;
    columns?: number;
    columnsPhone?: number;
    columnsTablet?: number;
    columnsDesktop?: number;
    gap?: number;
    style?: StyleProp<ViewStyle>;
}
export function ResponsiveGrid({ children, columns = 2, columnsPhone, columnsTablet, columnsDesktop, gap = 12, style, }: ResponsiveGridProps) {
    const { width } = useWindowDimensions();
    let resolvedColumns = columns;
    if (width < 375) {
        resolvedColumns = columnsPhone ?? 1;
    }
    else if (width >= 375 && width < 768) {
        resolvedColumns = columnsPhone ?? columns;
    }
    else if (width >= 768 && width < 1024) {
        resolvedColumns = columnsTablet ?? columns + 1;
    }
    else if (width >= 1024) {
        resolvedColumns = columnsDesktop ?? columnsTablet ?? columns + 2;
    }
    return (<View style={[styles.grid, style]}>
      {React.Children.map(children, (child) => {
            if (!child)
                return null;
            return (<View style={createViewWidthPaddingStyle(`${100 / resolvedColumns}%`, gap / 2)}>
            {child}
          </View>);
        })}
    </View>);
}

