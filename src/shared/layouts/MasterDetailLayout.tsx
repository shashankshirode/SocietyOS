import React from "react";
import { View, useWindowDimensions } from "react-native";
import { styles, createViewFlexStyle, createViewFlexStyle2 } from "./styles/MasterDetailLayout.styles";
interface MasterDetailLayoutProps {
    masterComponent: React.ReactNode;
    detailComponent: React.ReactNode;
    masterWidthPercentage?: number;
}
export function MasterDetailLayout({ masterComponent, detailComponent, masterWidthPercentage = 35, }: MasterDetailLayoutProps) {
    const { width } = useWindowDimensions();
    const isTabletLandscape = width > 900;
    if (!isTabletLandscape) {
        return <View style={styles.container}>{masterComponent}</View>;
    }
    const leftFlex = masterWidthPercentage / 100;
    const rightFlex = (100 - masterWidthPercentage) / 100;
    return (<View style={styles.splitRow}>
      <View style={[styles.masterPane, createViewFlexStyle(leftFlex)]}>
        {masterComponent}
      </View>
      <View style={styles.divider}/>
      <View style={[styles.detailPane, createViewFlexStyle2(rightFlex)]}>
        {detailComponent}
      </View>
    </View>);
}
export default MasterDetailLayout;
export const TwoPaneLayout = MasterDetailLayout;

