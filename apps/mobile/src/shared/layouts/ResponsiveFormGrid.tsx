import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Layout } from "../theme/layout";
import { Spacing } from "../theme/spacing";
import { styles, createViewGapStyle, createViewGapStyle2, createViewGapStyle3 } from "./styles/ResponsiveFormGrid.styles";
interface ResponsiveFormGridProps {
    children: React.ReactNode[];
    gap?: number;
}
export function ResponsiveFormGrid({ children, gap = Spacing.formGap, }: ResponsiveFormGridProps) {
    const { width } = useWindowDimensions();
    const isTablet = width > Layout.maxTabletContentWidth;
    const validChildren = React.Children.toArray(children).filter(Boolean);
    if (!isTablet) {
        return (<View style={createViewGapStyle(gap)}>
        {validChildren}
      </View>);
    }
    const rows: React.ReactNode[][] = [];
    for (let i = 0; i < validChildren.length; i += 2) {
        rows.push(validChildren.slice(i, i + 2));
    }
    return (<View style={createViewGapStyle2(gap)}>
      {rows.map((row, rowIndex) => (<View key={rowIndex} style={[styles.row, createViewGapStyle3(gap)]}>
          {row.map((child, colIndex) => (<View key={colIndex} style={styles.col}>
              {child}
            </View>))}
          {row.length === 1 && <View style={styles.col}/>}
        </View>))}
    </View>);
}
export default ResponsiveFormGrid;

