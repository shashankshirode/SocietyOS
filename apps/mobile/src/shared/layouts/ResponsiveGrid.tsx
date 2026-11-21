import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Layout } from "../theme/layout";
import { Spacing } from "../theme/spacing";
import { getRequiredItem } from "../utils/requiredItem";
import { styles, createViewGapStyle, createViewGapStyle2, createViewMarginTopStyle } from "./styles/ResponsiveGrid.styles";
interface ResponsiveGridProps {
    children: React.ReactNode[];
    columnsPhone?: number;
    columnsTablet?: number;
    gap?: number;
}
export function ResponsiveGrid({ children, columnsPhone = 1, columnsTablet = 2, gap = Spacing.cardGap, }: ResponsiveGridProps) {
    const { width } = useWindowDimensions();
    const isTablet = width > Layout.maxTabletContentWidth;
    const cols = isTablet ? columnsTablet : columnsPhone;
    if (cols === 1) {
        return <View style={createViewGapStyle(gap)}>{children}</View>;
    }
    const columnData: React.ReactNode[][] = Array.from({ length: cols }, () => []);
    children.forEach((child, index) => {
        if (child) {
            getRequiredItem(columnData, index % cols, "ResponsiveGrid.tsx").push(child);
        }
    });
    return (<View style={[styles.gridRow, createViewGapStyle2(gap)]}>
      {columnData.map((colItems, colIndex) => (<View key={colIndex} style={styles.gridColumn}>
          {colItems.map((item, itemIndex) => (<View key={itemIndex} style={itemIndex > 0 ? createViewMarginTopStyle(gap) : null}>
              {item}
            </View>))}
        </View>))}
    </View>);
}
export default ResponsiveGrid;

