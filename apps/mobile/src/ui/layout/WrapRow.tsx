import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { styles, createViewGapStyle } from "./styles/WrapRow.styles";
export interface WrapRowProps {
    children: React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function WrapRow({ children, gap = 6, style, testID }: WrapRowProps) {
    return (<View style={[styles.row, createViewGapStyle(gap), style]} testID={testID}>
      {children}
    </View>);
}

