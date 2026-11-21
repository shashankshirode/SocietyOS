import React from "react";
import { View, useWindowDimensions, ViewStyle, StyleProp } from "react-native";
import { styles, createViewGapStyle } from "./styles/AdaptiveActions.styles";
interface AdaptiveActionsProps {
    children: React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
}
export function AdaptiveActions({ children, gap = 12, style }: AdaptiveActionsProps) {
    const { width } = useWindowDimensions();
    const isSmall = width < 375;
    return (<View style={[
            isSmall ? styles.vertical : styles.horizontal,
            createViewGapStyle(gap),
            style,
        ]}>
      {children}
    </View>);
}

