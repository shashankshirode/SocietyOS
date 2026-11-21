import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles/QuickActionGrid.styles";
type QuickActionGridProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
export function QuickActionGrid({ children, style }: QuickActionGridProps) {
    return <View style={[styles.grid, style]}>{children}</View>;
}
export default QuickActionGrid;

