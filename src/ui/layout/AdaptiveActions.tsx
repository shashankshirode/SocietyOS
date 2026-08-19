import React from "react";
import { View, ViewStyle } from "react-native";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { styles } from "./styles/AdaptiveActions.styles";
interface AdaptiveActionsProps {
    children: React.ReactNode;
    style?: ViewStyle;
}
export function AdaptiveActions({ children, style }: AdaptiveActionsProps) {
    const { isSmall } = useResponsiveLayout();
    return (<View style={[
            isSmall ? styles.stacked : styles.row,
            style,
        ]}>
      {children}
    </View>);
}
export default AdaptiveActions;

